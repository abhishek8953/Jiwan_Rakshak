// controllers/hospitalController.js
import { PrismaClient } from '@prisma/client';
import { hospitalSchema } from "../zodSchema/hospital.schema.js";

const prisma = new PrismaClient();

export const createHospital = async (req, res) => {
  try {
    const validated = hospitalSchema.parse(req.body);
    const hospital = await prisma.hospital.create({ data: validated });
    res.status(201).json(hospital);
  } catch (error) {
    res.status(400).json({ error: error?.issues || error.message });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await prisma.hospital.findMany();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHospitalById = async (req, res) => {
  try {
    const hospital = await prisma.hospital.findUnique({
      where: { id: req.params.id }
    });
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHospital = async (req, res) => {
  try {
    const validated = hospitalSchema.partial().parse(req.body);
    const hospital = await prisma.hospital.update({
      where: { id: req.params.id },
      data: validated
    });
    res.json(hospital);
  } catch (error) {
    res.status(400).json({ error: error?.issues || error.message });
  }
};

export const deleteHospital = async (req, res) => {
  try {
    await prisma.hospital.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
