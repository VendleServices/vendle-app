import { Queue } from "bullmq"
import { redis } from "../redis";

export const pdfToVectorDatabaseQueue = new Queue('pdf-to-vector-database-queue', { connection: redis });