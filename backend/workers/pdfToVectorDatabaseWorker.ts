import { Worker } from "bullmq";
import { redis } from "../redis";
import { extractTextFromPdf, chunkText, embedText } from "../utils/contractorChat";
import { prisma } from "../db/prisma.js";

const worker = new Worker('pdf-to-vector-database-queue', async job => {
    console.log('Processing job: ', job.name, job.data);

    const filePath = job.data.filePath;

    if (filePath) {
        const text = await extractTextFromPdf(filePath);
        const chunks = chunkText(text);
        const embeddings = await embedText(chunks);
        return { text, chunks, embeddings };
    }
}, { connection: redis });

worker.on('completed', async (job, returnvalue) => {
    console.log(`Job completed: ${job?.id}`);
    console.log(returnvalue);

    const { text, chunks, embeddings } = returnvalue;
    if (!text || !chunks || !embeddings) {
        console.log("Missing some data");
    }

    const claimId = job.data.claimId;
    const userId = job.data.user?.id;
    const documentName = job.data?.fileName;

    await prisma.$transaction(async (tx) => {
        await tx.documentChunk.createMany({
            data: chunks?.map((content: string, index: number) => ({
                userId,
                claimId,
                documentName,
                chunkIndex: index,
                content
            })) || []
        });

        const documentChunks = await tx.documentChunk.findMany({
            where: {
                userId,
                claimId,
                documentName
            },
            orderBy: {
                chunkIndex: 'asc'
            }
        }) || [];

        const rows = documentChunks.map((chunk, i) => ({
            document_chunk_id: chunk.id,
            user_id: userId,
            claim_id: claimId,
            embedding: embeddings[i],
        }));

        await tx.$executeRaw`
            insert into document_embeddings (
              document_chunk_id,
              user_id,
              claim_id,
              embedding
            )
            select
              r.document_chunk_id::uuid,
              r.user_id::uuid,
              r.claim_id::uuid,
              r.embedding::vector
            from jsonb_to_recordset(${JSON.stringify(rows)}::jsonb)
            as r(
              document_chunk_id text,
              user_id text,
              claim_id text,
              embedding float8[]
            );
        `;
    });
});

worker.on('failed', async (job, error) => {
    console.log('Job failed', job?.id, error);
})
