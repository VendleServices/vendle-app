import { Router } from 'express';
import express from 'express';
import { prisma } from '../../db/prisma.js';
import { pusherServer } from "../../lib/pusherServer";

const router = Router();

// Parse URL-encoded bodies for Pusher auth requests
router.use(express.urlencoded({ extended: true }));

// Securely authorize users before they can join a private pusher channel
// Make sure only users who belong to a specific room are allowed to subscribe to its private real-time channel
router.post("/auth", async (req: any, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        // Pusher sends socket_id and channel_name in the request body
        const socketId = req.body.socket_id;
        const channel = req.body.channel_name;

        if (!socketId || !channel) {
            return res.status(400).json({ message: "Missing socket_id or channel_name" });
        }

        // Extract roomId from channel name (format: private-room-{roomId})
        const roomId = channel.replace("private-room-", "");

        // Verify user is a member of this room
        const isMember = await prisma.room.findFirst({
            where: {
                id: roomId,
                users: { some: { id: user.id } }
            }
        });

        if (!isMember) {
            return res.status(403).json({ error: "You are not a member of this room" });
        }

        // Authorize the channel subscription
        const authResponse = pusherServer.authorizeChannel(socketId, channel);
        return res.send(authResponse);
    } catch (error) {
        console.error("Pusher auth error:", error);
        return res.status(500).json({ message: "Error authorizing Pusher channel" });
    }
});

export default router;