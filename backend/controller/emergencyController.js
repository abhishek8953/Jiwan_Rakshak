import prisma from "../config/db.js";
import { emergencySchema } from "../zodSchema/emergency.Scehema.js";
import nodemailer from "nodemailer";
import twilio from "twilio";

// Optional: configure mailer and twilio here
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Create
export const createEmergency = async (req, res) => {
  try {
    const parsed = emergencySchema.parse(req.body);
    const emergency = await prisma.emergency.create({ data: parsed });
    res.status(201).json(emergency);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read all
export const getEmergencies = async (req, res) => {
  const emergencies = await prisma.emergency.findMany();
  res.json(emergencies);
};

export const getEmergenciesUser = async (req, res) => {
  const emergencies = await prisma.emergency.findMany({where:{userId:req.params.id}});
  res.json(emergencies);
};

// Read one
export const getEmergency = async (req, res) => {
  const { id } = req.params;
  const emergency = await prisma.emergency.findUnique({ where: { id } });
  if (!emergency) return res.status(404).json({ error: "Not found" });
  res.json(emergency);
};

// Update
export const updateEmergency = async (req, res) => {
  const { id } = req.params;
  try {
    const parsed = emergencySchema.parse(req.body);
    const updated = await prisma.emergency.update({
      where: { id },
      data: parsed,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
export const deleteEmergency = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.emergency.delete({ where: { id } });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Notify All Emergency Contacts
export const notifyEmergencies = async (req, res) => {
  const { userId } = req.params;

  try {
    const emergencies = await prisma.emergency.findMany({
      where: { userId },
    });

    if (emergencies.length === 0)
      return res.status(404).json({ error: "No emergency contacts found" });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const message = `Alert from ${user.name}! Please check in with them ASAP.`;

    // Send Emails and SMS
    for (let contact of emergencies) {
      // Send Email
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: contact.mobileNo + "@sms.gateway.com", // replace if using email-to-sms gateway
        subject: "Emergency Alert",
        text: message,
      });

      // Send SMS
      await twilioClient.messages.create({
        body: message,
        to: `+91${contact.mobileNo}`,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    }

    res.json({ message: "Notifications sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
