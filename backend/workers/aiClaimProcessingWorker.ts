import { Worker } from "bullmq";
import { redis } from "../redis";
import { processClaimDocument } from "../utils/processClaimDocument";
import OpenAI from "openai";
import { prisma } from "../db/prisma.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const worker = new Worker('ai-claim-processing-queue', async job => {
    console.log('Processing job: ', job.name, job.data);

    const filePath = job.data.filePath;

    let aiClaimSummary: any = "";

    if (filePath) {
        aiClaimSummary = await processClaimDocument(filePath);
        aiClaimSummary = typeof aiClaimSummary === "object" ? aiClaimSummary?.document?.text : aiClaimSummary;

        const response = await openai.responses.create({
            model: "gpt-5",
            input: `Summarize the following information into a short paragraph of 120 words or less: ${aiClaimSummary}`,
        });

        aiClaimSummary = response?.output_text;
        return aiClaimSummary;
    }
}, { connection: redis });

worker.on('completed', async (job, returnvalue) => {
    console.log(`Job completed: ${job.id}`);
    console.log(returnvalue);

    const user = job.data?.user;
    const claimId: string = job.data?.claimId;

    if (!user || !claimId) {
        console.log("missing data");
    }

    if (returnvalue) {
        await prisma.claim.update({
            where: {
                id: claimId,
                userId: user.id,
            },
            data: {
                aiSummary: returnvalue,
            }
        });
    }
});

worker.on('failed', async (job, error) => {
    console.error(`Job ${job?.id} failed:`, error);
});