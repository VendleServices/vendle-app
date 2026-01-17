import crypto from "crypto";
import { Router } from 'express';
import { prisma } from "../../db/prisma";

const router = Router();

router.post("/start", async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(403).json({ error: "User not found" });
        }

        const { contractorId, homeownerId } = req.body;
        const bookingToken = crypto.randomUUID();

        const availability = await prisma.homeownerAvailability.findMany({
            where: {
                homeownerId,
            }
        });

        if (!availability?.length) {
            return res.status(400).json({ message: "No availability found" });
        }

        await prisma.bookingAttempt.create({
            data: {
                bookingToken,
                contractorId,
                homeownerId,
                status: "PENDING"
            }
        });

        const calendlyUrl = process.env.BASE_CALENDLY_URL + `?utm_campaign=${bookingToken}`;

        return res.status(201).json({ calendlyUrl });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error creating booking" });
    }
});

router.get('/meetings/:bookingToken', async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(403).json({ error: "User not found" });
        }

        const { bookingToken } = req.params;
        const meeting = await prisma.meeting.findUnique({
            where: {
                bookingToken
            }
        });

        if (!meeting) {
            return res.status(404).json({ error: "Missing booking token" });
        }

        return res.status(200).json({ meeting });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching meeting." })
    }
});

router.post("/availability", async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(403).json({ error: "User not found" });
        }

        const { dayOfWeek, startTime, endTime } = req.body;

        const homeownerAvailability = await prisma.homeownerAvailability.create({
            data: {
                homeownerId: user.id,
                dayOfWeek,
                startTime,
                endTime
            }
        });

        return res.status(201).json({ homeownerAvailability });
    } catch (error) {
        return res.status(500).json({ error: "Error creating availability" });
    }
});

router.get("/availability", async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(403).json({ error: "User not found" });
        }

        const availability = await prisma.homeownerAvailability.findMany({
            where: {
                homeownerId: user.id
            }
        });

        return res.status(200).json({ availability });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching availability" });
    }
});

// Get a specific homeowner's availability (for contractors)
router.get("/availability/:homeownerId", async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(403).json({ error: "User not found" });
        }

        const { homeownerId } = req.params;

        const availability = await prisma.homeownerAvailability.findMany({
            where: {
                homeownerId
            }
        });

        return res.status(200).json({ availability });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching homeowner availability" });
    }
});

router.put('/availability/:id', async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(403).json({ error: "User not authorized" });
        }

        const { id } = req.params;
        const { dayOfWeek, startTime, endTime } = req.body;
        const updatedAvailability = await prisma.homeownerAvailability.updateMany({
            where: {
                id,
                homeownerId: user.id
            },
            data: {
                dayOfWeek,
                startTime,
                endTime
            }
        });

        return res.status(200).json({ updatedAvailability });
    } catch (error) {
        return res.status(500).json({ error: "Error updating availability" });
    }
});

router.delete("/availability/:id", async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(403).json({ error: "User not authorized" });
        }

        const { id } = req.params;

        await prisma.homeownerAvailability.deleteMany({
            where: {
                id,
                homeownerId: user.id
            }
        });

        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ error: "Error deleting availability" });
    }
})

export default router;

