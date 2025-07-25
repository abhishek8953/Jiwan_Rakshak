import { PrismaClient } from "@prisma/client";
import { medicineReminderSchema, updateMedicineReminderSchema } from "../validators/medicineReminder.validator";
import { Request, Response } from "express";
import { scheduleReminder } from "../utils/scheduler";

const prisma = new PrismaClient();

export const createReminder = async (req, res) => {
  try {
    const data = medicineReminderSchema.parse(req.body);
    const reminder = await prisma.medicineReminder.create({ data });

    scheduleReminder(reminder); // Schedule it
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllReminders = async (req, res) => {
  const reminders = await prisma.medicineReminder.findMany();
  res.json(reminders);
};

export const updateReminder = async (req, res) => {
  const id = req.params.id;
  try {
    const data = updateMedicineReminderSchema.parse(req.body);
    const reminder = await prisma.medicineReminder.update({ where: { id }, data });

    scheduleReminder(reminder); // Reschedule updated
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteReminder = async (req, res) => {
  const id = req.params.id;
  await prisma.medicineReminder.delete({ where: { id } });
  res.json({ message: "Deleted" });
};
