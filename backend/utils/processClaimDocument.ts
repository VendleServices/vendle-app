import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import path from 'path';
import fs from 'fs';

export async function processClaimDocument(filePath: any) {
    // sav comments for learning - file.arraybuffer reads file and converts it to binary, buffer is used to handle binary data
    // computers, apis process files as binary bytes
    // let fileBuffer: Buffer;
    // let mimeType: string;
    //
    // if ('buffer' in file) {
    //     // Multer file
    //     fileBuffer = file.buffer;
    //     mimeType = file?.mimetype;
    // } else {
    //     // Browser File
    //     fileBuffer = Buffer.from(await file.arrayBuffer());
    //     mimeType = file.type;
    // }

    if (fs.existsSync(filePath)) {
        console.log("File exists ✅");
    } else {
        console.log("File does NOT exist ❌");
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Load credentials from env var (production) or file (local dev)
    let credentials;
    if (process.env.GOOGLE_SERVICE_ACCOUNT) {
        credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    } else {
        const credentialsPath = path.join(process.cwd(), 'credentials', 'service-account.json');
        credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    }

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
            mimeType: "application/pdf",
        }
    };

    try {
        const [result] = await client?.processDocument(request);
        return result;
    } catch (error) {
        console.log(error);
    }
}