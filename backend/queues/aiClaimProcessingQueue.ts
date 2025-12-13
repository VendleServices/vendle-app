import { Queue } from "bullmq";
import { redis } from "../redis";

// background jobs lets server run tasks asynchronously -> outside the main request - response cycle
// examples like processing files
// we need a job queue
// express runs on node.js -> runs on single thread which should stay free for requests, heavy work -> slow users -> crashes under load
// job queue offload long tasks

export const aiClaimProcessingQueue = new Queue('ai-claim-processing-queue', { connection: redis });