import * as PdfParse from 'pdf-parse-new';
import fs from "fs"
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export async function extractTextFromPdf(filePath: string) {
    // dataBuffer loads the file as binary
    const parser = new PdfParse.SmartPDFParser({
        enableFastPath: true,   // Skips unnecessary rendering steps
        enableCache: true       // Speeds up repetitive tasks
    });

    const dataBuffer = fs.readFileSync(filePath);
    const data = await parser.parse(dataBuffer);
    // the pdf text
    return data.text;
}

export function chunkText(
    text: string,
    chunkSize = 800,
    overlap = 100
) {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = start + chunkSize;
        const chunk = text.slice(start, end).trim();
        if (chunk) chunks.push(chunk);
        start = end - overlap;
    }

    return chunks;
}

export async function embedText(chunks: any) {
    const embeddings = [];

    for (const chunk of chunks) {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: chunk,
        });

        embeddings.push(response.data[0].embedding);
    }

    return embeddings;
}

