import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get("/:claimId", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { claimId } = req.params;

        const project = await prisma.project.findUnique({
            where: {
                claimId,
            }
        });

        return res.status(200).json({ project });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching project" });
    }
});

router.post("/:claimId", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { claimId } = req.params;
        const { contractorId } = req.body;

        const newProject = await prisma.project.create({
            data: {
                claimId,
                contractorId,
            }
        });

        return res.status(201).json({ newProject });
    } catch (error) {
        return res.status(500).json({ error: "Error creating project" });
    }
});

export default router;