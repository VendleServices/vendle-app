import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

// Get all rooms for current user with unread counts (deduplicated)
router.get('/', async (req: any, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const rooms = await prisma.room.findMany({
            where: {
                users: { some: { id: user.id } }
            },
            include: {
                users: {
                    where: { NOT: { id: user.id } },
                    select: { id: true, email: true, companyName: true, userType: true }
                },
                roomReadStatuses: {
                    where: { userId: user.id }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    include: { sender: { select: { email: true } } }
                },
                _count: {
                    select: { messages: true }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Deduplicate rooms: keep only the room with most messages for each user pair
        const seenUsers = new Map<string, any>();
        const deduplicatedRooms: any[] = [];

        for (const room of rooms) {
            const otherUserId = room.users[0]?.id;
            if (!otherUserId) continue;

            const existingRoom = seenUsers.get(otherUserId);
            if (!existingRoom) {
                seenUsers.set(otherUserId, room);
                deduplicatedRooms.push(room);
            } else {
                // Keep the room with more messages
                if ((room as any)._count.messages > (existingRoom as any)._count.messages) {
                    // Replace with this room
                    const idx = deduplicatedRooms.indexOf(existingRoom);
                    if (idx !== -1) {
                        deduplicatedRooms[idx] = room;
                        seenUsers.set(otherUserId, room);
                    }
                }
            }
        }

        const roomsWithMeta = await Promise.all(deduplicatedRooms.map(async (room: any) => {
            const lastRead = room?.roomReadStatuses?.[0]?.lastReadAt || new Date(0);

            const unreadCount = await prisma.message.count({
                where: {
                    roomId: room.id,
                    createdAt: { gt: lastRead },
                    NOT: { userId: user.id }
                }
            });

            return {
                id: room.id,
                otherUser: room.users[0],
                lastMessage: room.messages[0] || null,
                unreadCount: unreadCount,
                updatedAt: room.updatedAt
            };
        }));

        // Calculate total unread count
        const totalUnread = roomsWithMeta.reduce((sum, room) => sum + room.unreadCount, 0);

        return res.status(200).json({ rooms: roomsWithMeta, totalUnread });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error getting rooms" });
    }
});

// Get total unread message count for the user
router.get('/unread-count', async (req: any, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const rooms = await prisma.room.findMany({
            where: { users: { some: { id: user.id } } },
            include: {
                roomReadStatuses: {
                    where: { userId: user.id }
                }
            }
        });

        let totalUnread = 0;
        for (const room of rooms) {
            const lastRead = (room as any).roomReadStatuses?.[0]?.lastReadAt || new Date(0);
            const unreadCount = await prisma.message.count({
                where: {
                    roomId: room.id,
                    createdAt: { gt: lastRead },
                    NOT: { userId: user.id }
                }
            });
            totalUnread += unreadCount;
        }

        return res.status(200).json({ totalUnread });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error getting unread count" });
    }
});

// Get messages for a specific room
router.get('/:roomId/messages', async (req: any, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { roomId } = req.params;

        // Verify user is a member of this room
        const room = await prisma.room.findFirst({
            where: {
                id: roomId,
                users: { some: { id: user.id } }
            }
        });

        if (!room) {
            return res.status(403).json({ error: "You are not a member of this room" });
        }

        const messages = await prisma.message.findMany({
            where: { roomId },
            include: {
                sender: {
                    select: { id: true, email: true, companyName: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        return res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error getting messages" });
    }
});

// Initiate or get existing room between two users
router.post('/initiate', async (req: any, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        // Accept either otherUserId or homeownerId for backwards compatibility
        const otherUserId = req.body.otherUserId || req.body.homeownerId;

        if (!otherUserId) {
            return res.status(422).json({ error: 'Missing otherUserId parameter' });
        }

        // Don't allow creating a room with yourself
        if (otherUserId === user.id) {
            return res.status(400).json({ error: "Cannot create a room with yourself" });
        }

        // Use transaction to prevent race conditions creating duplicate rooms
        const result = await prisma.$transaction(async (tx) => {
            // Check if room already exists
            const existingRoom = await tx.room.findFirst({
                where: {
                    AND: [
                        { users: { some: { id: user.id } } },
                        { users: { some: { id: otherUserId } } },
                    ]
                },
                include: {
                    users: {
                        where: { NOT: { id: user.id } },
                        select: { id: true, email: true, companyName: true, userType: true }
                    }
                }
            });

            if (existingRoom) {
                return {
                    room: existingRoom,
                    otherUser: existingRoom.users[0],
                    isNew: false
                };
            }

            // Create new room
            const newRoom = await tx.room.create({
                data: {
                    users: {
                        connect: [{ id: user.id }, { id: otherUserId }],
                    },
                    roomReadStatuses: {
                        create: [
                            { userId: user.id },
                            { userId: otherUserId }
                        ],
                    }
                },
                include: {
                    users: {
                        where: { NOT: { id: user.id } },
                        select: { id: true, email: true, companyName: true, userType: true }
                    }
                }
            });

            return {
                room: newRoom,
                otherUser: newRoom.users[0],
                isNew: true
            };
        });

        return res.status(result.isNew ? 201 : 200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error creating room" });
    }
});

router.post('/:roomId/read', async (req: any, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized"})
        }

        const { roomId } = req.params;

        const status = await prisma.roomReadStatus.upsert({
            where: {
                userId_roomId: {
                    userId: user.id,
                    roomId,
                }
            },
            update: { lastReadAt: new Date() },
            create: {
                userId: user.id,
                roomId,
                lastReadAt: new Date()
            }
        });

        return res.status(200).json({ status });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error reading room" });
    }
});

export default router;