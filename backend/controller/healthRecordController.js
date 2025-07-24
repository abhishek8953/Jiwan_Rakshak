import { PrismaClient } from '@prisma/client';
import { healthRecordSchema, healthRecordUpdateSchema } from '../zodSchema/healthRecord.schema.js';
import {v2 as cloudinary} from "cloudinary"
import {extractPublicIdFromUrl} from "../config/extractPublicId.js"

const prisma = new PrismaClient();

// CREATE
export const createHealthRecord = async (req, res) => {
  try {
    const data = healthRecordSchema.parse(req.body);

    const file = req.file;
    if (!file) return res.status(400).json({ error: 'File is required' });
     console.log(file.path);
    const record = await prisma.healthRecord.create({
      data: {
        ...data,
        date:new Date(Date.now()),
        url: file.path // store file path or URL
      }
    });

    res.status(201).json(record);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getAllHealthRecords = async (req, res) => {
  try {
     const records = await prisma.healthRecord.findMany()
     
    
   
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
export const getHealthRecordById = async (req, res) => {
  try {
    const record = await prisma.healthRecord.findUnique({ where: { id: req.params.id } });
    if (!record) return res.status(404).json({ error: 'Not found' });
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
export const updateHealthRecord = async (req, res) => {
  try {
    const data = healthRecordUpdateSchema.parse(req.body);
    const file = req.file;

    const updateData = {
      ...data,
      ...(file &&  {url:file.path})
    };

    const record = await prisma.healthRecord.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json(record);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteHealthRecord = async (req, res) => {
  try {
    // Step 1: Get record to fetch Cloudinary public_id
    const record = await prisma.healthRecord.findUnique({
      where: { id: req.params.id },
    });

    if (!record) return res.status(404).json({ error: 'Record not found' });
   
    // Step 2: Delete from Cloudinary
    if (record.url) {
      const public_id=extractPublicIdFromUrl(record.url)
      await cloudinary.uploader.destroy(public_id);
    }

    // Step 3: Delete from DB
    await prisma.healthRecord.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


//by user id
export const getHRByUser = async (req, res) => {
  const { userId } = req.params;
  const hrs = await prisma.healthRecord.findMany({
    where: { userId },
    orderBy: { date: "desc" }
  });
  res.json(hrs);
};