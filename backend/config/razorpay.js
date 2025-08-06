// src/utils/razorpay.ts
import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const verifyPayment = (order_id, payment_id, signature) => {
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  hmac.update(`${order_id}|${payment_id}`);
  const digest = hmac.digest("hex");
  return digest === signature;
};
