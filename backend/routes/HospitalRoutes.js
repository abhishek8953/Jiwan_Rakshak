// routes/hospitalRoutes.js
import express from 'express';
import {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
} from '../controller/hospitalController.js';
import upload from '../config/cludinary.js';

const router = express.Router();

router.post('/',upload.single("file"),createHospital);
router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);
router.put('/:id', updateHospital);
router.delete('/:id', deleteHospital);

export default router;
