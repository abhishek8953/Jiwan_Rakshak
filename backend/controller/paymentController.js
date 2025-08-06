// controllers/payment.controller.ts

import razorpay from "../config/razorpay.js";
import prisma from "../config/db.js";

export const createSubscription = async (req, res) => {
  try {
    const { labId } = req.body;

    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID, // 1-month plan created on Razorpay dashboard
      customer_notify: 1,
      total_count: 1,
    });

    // Save subscription status to lab
    const now = new Date();
    const oneMonthLater = new Date(now);
    oneMonthLater.setMonth(now.getMonth() + 1);

    await prisma.lab.update({
      where: { id: labId },
      data: {
        isSubscribed: true,
        subscriptionStart: now,
        subscriptionEnd: oneMonthLater,
      },
    });

    res.json({ success: true, subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
};
