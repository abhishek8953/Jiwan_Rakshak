import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByUserId,
  updateAppointment,
  deleteAppointment,
} from "../controller/appotmentsController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.get("/:id", getAppointmentById);
router.get("/user/:userId", getAppointmentsByUserId); // filter by user
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;
