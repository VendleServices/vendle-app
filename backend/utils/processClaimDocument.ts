import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import path from 'path';
import fs from 'fs';

export async function processClaimDocument(file: any) {
    // sav comments for learning - file.arraybuffer reads file and converts it to binary, buffer is used to handle binary data
    // computers, apis process files as binary bytes
    let fileBuffer: Buffer;
    let mimeType: string;

    if ('buffer' in file) {
        // Multer file
        fileBuffer = file.buffer;
        mimeType = file?.mimetype;
    } else {
        // Browser File
        fileBuffer = Buffer.from(await file.arrayBuffer());
        mimeType = file.type;
    }

    const credentialsPath = path.join(process.cwd(), 'credentials', 'service-account.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    const client = new DocumentProcessorServiceClient({
        credentials: {
            client_email: credentials.client_email,
            private_key: credentials.private_key,
        },
    });

    const request = {
        // base 64 encodes binary data as a string
        // http and json like this format, base64 ensures binary data isnt corrypted in transit
        name: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/us/processors/${process.env.GOOGLE_PROCESSOR_ID}`,
        rawDocument: {
            content: fileBuffer?.toString('base64'),
            mimeType,
        }
    };

    const [result] = await client?.processDocument(request);
    return result;
}