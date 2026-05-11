import { Queue, Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { DevpostAdapter } from "../adapters/devpost.adapter";
import { DataIngestionService } from "../core/ingestion";
import { Logger } from "@/server/utils/logger";
import { ScrapedOpportunity } from "../core/types";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

export const scraperQueue = new Queue("scraper-queue", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
  },
});

export const scraperWorker = new Worker(
  "scraper-queue",
  async (job: Job) => {
    const { source } = job.data;
    Logger.info(`Processing scrape job for: ${source}`);

    let opportunities: ScrapedOpportunity[] = [];

    if (source === "Devpost") {
      const adapter = new DevpostAdapter();
      opportunities = await adapter.scrape();
    }
    // Add other adapters here

    if (opportunities.length > 0) {
      await DataIngestionService.ingest(opportunities);
    }

    return { count: opportunities.length };
  },
  { connection }
);

scraperWorker.on("completed", (job) => {
  Logger.info(`Job ${job.id} completed successfully.`);
});

scraperWorker.on("failed", (job, err) => {
  Logger.error(`Job ${job?.id} failed: ${err.message}`);
});
