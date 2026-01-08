import { Worker } from "bullmq";
import { redis } from "../redis";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const worker = new Worker('email-queue', async job => {
    console.log('Processing job: ', job.name, job.data);

    const result = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [job?.data?.email],
        subject: job?.data?.subject,
        html: `
            <p>${job.data?.message || "Visit Vendle!"}</p>
            <p>Log in to Vendle to see!</p>
      `,
    });

    return result;
}, { connection: redis });

worker.on('completed', async (job, returnvalue) => {
    console.log(`Job completed: ${job.id}`);
    console.log(returnvalue);
});

worker.on('failed', async (job, error) => {
    console.error(`Job ${job?.id} failed:`, error);
});

