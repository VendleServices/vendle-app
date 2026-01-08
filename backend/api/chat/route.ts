import { Router } from 'express';
import { prisma } from "../../db/prisma";
import OpenAI from "openai";
import { chatbotLimiter } from "../../lib/rateLimiters";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const router = Router();

router.get("/:claimId", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { claimId } = req.params;

        const existingChats = await prisma.chat.findMany({
            where: {
                userId: user.id,
                claimId
            }
        }) || [];

        return res.status(200).json({ existingChats });
    } catch (error) {
        return res.status(500).json({ error: "Error retrieving chats" });
    }
})

router.post("/:claimId", chatbotLimiter, async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { claimId } = req.params;
        const { question, existingChats } = req.body;

        if (!question || !existingChats) {
            return res.status(400).json({ error: "Incorrect payload" });
        }

        const openAiResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: question,
        });

        const queryEmbedding = openAiResponse.data[0].embedding;

        const k = 5;

        const matches = await prisma.$queryRaw<
            { document_chunk_id: string; similarity: number }[]
        >`
          select
            document_chunk_id,
            1 - (embedding <=> ${queryEmbedding}::vector) as similarity
          from document_embeddings
          where claim_id = ${claimId}::uuid
          order by similarity desc
          limit ${k};
        `;

        const chunks = await prisma.documentChunk.findMany({
            where: {
                id: { in: matches?.map((match: any) => match.document_chunk_id) },
            }
        });

        const chunkMap = new Map(chunks?.map(c => [c.id, c]));

        const rankedChunks = matches?.map((match: any) => ({
            ...chunkMap.get(match.document_chunk_id),
            similarity: match.similarity,
        })) || [];

        const context = (rankedChunks?.map((chunk: any)=> chunk.content) || [])?.join("\n\n---\n\n");

        const recentChatHistory = (existingChats?.map((chat: any) => chat?.role === "User" ? `User: ${chat.content}` : `Assistant: ${chat.content}`) || [])?.slice(-8)?.join("\n");

        const prompt = `
            You are an insurance claims assistant.
            
            Answer the question using ONLY the context below.
            If the answer is not present, say "I don't know".
            
            Conversation History
            ${recentChatHistory}
            
            Context:
            ${context}
            
            Question:
            ${question}
        `;

        const openAiChatResponse = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                { role: "system", content: "You are a careful insurance claims assistant." },
                { role: "user", content: prompt },
            ],
        });

        const answer = openAiChatResponse?.choices?.[0]?.message?.content || "No answer available.";

        await prisma.chat.createMany({
            data: [
                {
                    userId: user.id,
                    claimId,
                    role: "USER",
                    content: question,
                },
                {
                    userId: user.id,
                    claimId,
                    role: "SYSTEM",
                    content: answer,
                }
            ]
        });

        return res.status(200).json({ answer, context, matches, chunks });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending chat" });
    }
});

export default router;