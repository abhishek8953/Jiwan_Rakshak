// src/controllers/lab.controller.ts
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const createLab = async (req, res) => {
  const lab = await prisma.lab.create({ data: req.body });
  res.status(201).json(lab);
};

export const getLabs = async (req, res) => {
  const labs = await prisma.lab.findMany();
  res.json(labs);
};

export const getLabById = async (req, res) => {
  const lab = await prisma.lab.findUnique({ where: { id: req.params.id } });
  if (!lab) return res.status(404).json({ error: "Lab not found" });
  res.json(lab);
};

export const updateLab = async (req, res) => {
  const lab = await prisma.lab.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(lab);
};

export const deleteLab = async (req, res) => {
  await prisma.lab.delete({ where: { id: req.params.id } });
  res.status(204).send();
};
