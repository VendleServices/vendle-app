import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { id, email } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(500).json({ message: 'User already exists' });
        }

        await prisma.user.create({
            data: {
                id, email
            }
        });

        return res.status(201).json({ message: "Created user successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;