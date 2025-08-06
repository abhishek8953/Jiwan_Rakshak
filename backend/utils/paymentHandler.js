// src/utils/payment.handlers.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handlePaymentCaptured = async (payment) => {
  const orderId = payment.order_id;
  const paymentId = payment.id;
  const amount = payment.amount / 100;

  const existingPayment = await prisma.payment.findUnique({
    where: { razorpayOrderId: orderId },
  });

  if (!existingPayment || existingPayment.status === "PAID") return;

  await prisma.payment.update({
    where: { razorpayOrderId: orderId },
    data: {
      status: "PAID",
      razorpayPaymentId: paymentId,
    },
  });

  const subscriptionEnd = new Date();
  subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

  await prisma.lab.updateMany({
    where: { userId: existingPayment.userId },
    data: {
      isSubscribed: true,
      subscriptionStart: new Date(),
      subscriptionEnd,
    },
  });

  console.log("Payment captured and lab activated");
};

export const handlePaymentFailed = async (payment) => {
  const orderId = payment.order_id;

  await prisma.payment.updateMany({
    where: { razorpayOrderId: orderId },
    data: { status: "FAILED" },
  });

  console.warn("Payment failed for order", orderId);
};
