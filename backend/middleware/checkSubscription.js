// src/middlewares/checkSubscription.ts
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const checkLabSubscription = async (req, res, next) => {
  const userId = req.body.userId;
  const lab = await prisma.lab.findFirst({ where: { userId } });

  if (!lab || !lab.isSubscribed || !lab.subscriptionEnd || new Date() > lab.subscriptionEnd) {
    return res.status(403).json({ error: "Subscription expired or not active." });
  }

  next();
};
