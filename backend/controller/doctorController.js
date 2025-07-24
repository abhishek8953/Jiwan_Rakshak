import { PrismaClient } from '@prisma/client';
import { doctorSchema, doctorUpdateSchema } from "../zodSchema/doctor.schema.js";

const prisma = new PrismaClient();

// CREATE
export const createDoctor = async (req, res) => {
  try {
    const data = doctorSchema.parse(req.body);
    const doctor = await prisma.doctor.create({ data });
    res.status(201).json({message:"created successfully",doctor});
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { id: req.params.id } });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
export const updateDoctor = async (req, res) => {
  try {
    const data = doctorUpdateSchema.parse(req.body);
    const doctor = await prisma.doctor.update({
      where: { id: req.params.id },
      data,
    });
    res.json(doctor);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteDoctor = async (req, res) => {
  try {
    await prisma.doctor.delete({ where: { id: req.params.id } });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
