import express from 'express';
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
} from '../controller/doctorController.js';
import upload from '../config/cludinary.js';

const router = express.Router();

router.post('/',upload.single("file"),createDoctor);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

export default router;
