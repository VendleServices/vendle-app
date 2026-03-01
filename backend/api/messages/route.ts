import { Router } from 'express';
import { prisma } from '../../db/prisma.js';
import { pusherServer } from "../../lib/pusherServer";

const router = Router();

router.post('/', async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }
        // frontend sends message content and destination room
        const { content, roomId } = req.body;

        const isParticipant = await prisma.room.findFirst({
            where: {
                id: roomId,
                users: { some: { id: user.id } }
            }
        })

        if (!isParticipant) {
            return res.status(403).json({ error: "Not authorized to access this channel" });
        }

        const newMessage = await prisma.$transaction(async (tx) => {
            const message = await tx.message.create({
                data: {
                    content,
                    roomId,
                    userId: user.id
                },
                include: {
                    sender: true
                }
            });

            await tx.room.update({
                where: {
                    id: roomId
                },
                data: {
                    updatedAt: new Date()
                }
            });

            return message;
        });

        // broadcast this message to the private channel named after the room id
        await pusherServer.trigger(`private-room-${roomId}`, 'new-message', newMessage);

        return res.status(201).json({ newMessage });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error posting message" });
    }
});

export default router;