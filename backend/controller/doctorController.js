import { PrismaClient,Prisma } from '@prisma/client';
import { doctorSchema,specialitySchema } from "../zodSchema/doctor.schema.js";

const prisma = new PrismaClient();

// CREATE
export const createDoctor = async (req, res) => {
  try {
    const result = doctorSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation error",
        details: result.error.errors
      });
    }

    const {
      name,
      email,
      age,
      mobileNo,
      address,
      rating,
      active,
      languages,
      fee,
      specialities
    } = result.data;

    const newDoctor = await prisma.doctor.create({
      data: {
        name,
        email,
        age,
        mobileNo,
        address,
        photo: req.file?.path ?? null,
        rating,
        active,
        languages,
        fee,
        specialities: {
          create: specialities
        }
      },
      include: {
        specialities: true
      }
    });

    res.status(201).json({ message: "Doctor created successfully", doctor: newDoctor });
  } catch (error) {
    console.error("Error creating doctor:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({
        error: "Database error",
        message: error.message,
        code: error.code
      });
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({
        error: "Invalid data sent to database",
        message: error.message
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
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
    const data = doctorSchema.parse(req.body);
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
