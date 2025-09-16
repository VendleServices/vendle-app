import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { id, email, userType, companyName, companyWebsite, phoneNumber } = req.body;

        if (!id || !email) {
            return res.status(400).json({ message: 'Missing required fields: id and email' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!existingUser) {
            await prisma.user.create({
                data: {
                    id,
                    email,
                    userType,
                    companyName,
                    companyWebsite,
                    phoneNumber,
                }
            });
        }

        return res.status(201).json({ message: "Created user successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;