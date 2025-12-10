import { Worker } from "bullmq";
import { redis } from "../redis";
import { processClaimDocument } from "../utils/processClaimDocument";
import OpenAI from "openai";

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

    const token = job.data.user?.token;
    if (!token) {
        console.log("no token");
    }

    const claimId = job.data.claimId;

    if (returnvalue) {
        await fetch(`http://localhost:3001/api/claim/${claimId}`, {
            method: "PUT",
            body: JSON.stringify({ aiClaimSummary: returnvalue }),
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
    }
});

worker.on('failed', async (job, error) => {
    console.error(`Job ${job?.id} failed:`, error);
});