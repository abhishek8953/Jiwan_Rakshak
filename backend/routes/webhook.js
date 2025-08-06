// src/routes/webhook.routes.ts
import express from "express";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Use express.raw middleware in `index.ts` for this route
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"] 

  const generatedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(req.body)
    .digest("hex");

  if (generatedSignature !== signature) {
    console.error("Webhook signature mismatch");
    return res.status(400).send("Invalid signature");
  }

  const event = JSON.parse(req.body.toString());

  const { entity } = event.payload.payment || event.payload.order || {};

  switch (event.event) {
    case "payment.captured":
      await handlePaymentCaptured(entity);
      break;
    case "payment.failed":
      await handlePaymentFailed(entity);
      break;
    case "order.paid":
      // Optional fallback
      break;
    default:
      console.log("Unhandled webhook:", event.event);
  }

  res.status(200).json({ received: true });
});

export default router;
