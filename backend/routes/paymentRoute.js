// src/routes/payment.routes.ts
import express from "express";
import { razorpay, verifyPayment } from "../config/razorpay.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/payments/create-order
router.post("/create-order", async (req, res) => {
  const { amount, userId } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  // Store in DB
  await prisma.payment.create({
    data: {
      userId,
      razorpayOrderId: order.id,
      amount,
      status: "PENDING",
    },
  });

  res.json(order);
});


// const options = {
//   key: "rzp_test_XXXX",
//   amount: order.amount,
//   currency: order.currency,
//   name: "Lab Subscription",
//   order_id: order.id,
//   handler: function (response) {
//     // Send this to your backend
//     axios.post("/api/payments/verify", {
//       razorpay_order_id: response.razorpay_order_id,
//       razorpay_payment_id: response.razorpay_payment_id,
//       razorpay_signature: response.razorpay_signature,
//       userId
//     });
//   },
// };
// new Razorpay(options).open();


// POST /api/payments/verify
router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
  } = req.body;

  const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  if (!isValid) {
    await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: { status: "FAILED" },
    });

    return res.status(400).json({ error: "Invalid signature" });
  }

  const existing = await prisma.payment.findUnique({
    where: { razorpayOrderId: razorpay_order_id },
  });

  if (!existing || existing.status === "PAID") {
    return res.status(409).json({ error: "Payment already processed" });
  }

  await prisma.payment.update({
    where: { razorpayOrderId: razorpay_order_id },
    data: {
      status: "PAID",
      razorpayPaymentId: razorpay_payment_id,
    },
  });

  const subscriptionEnd = new Date();
  subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

  await prisma.lab.updateMany({
    where: { userId },
    data: {
      isSubscribed: true,
      subscriptionStart: new Date(),
      subscriptionEnd,
    },
  });

  res.json({ success: true });
});


export default router;
