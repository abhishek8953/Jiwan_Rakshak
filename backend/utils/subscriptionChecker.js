// src/jobs/subscriptionCron.ts
import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
console.log("dd");
// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  await prisma.lab.updateMany({
    where: {
      subscriptionEnd: { lt: now },
      isSubscribed: true,
    },
    data: {
      isSubscribed: false,
      subscriptionStart: null,
      subscriptionEnd: null,
    },
  });

  console.log("Expired labs unsubscribed automatically.");
});
