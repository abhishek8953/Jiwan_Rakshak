import express from "express";
import {
  createEmergency,
  getEmergencies,
  getEmergency,
  updateEmergency,
  deleteEmergency,
  notifyEmergencies,
  getEmergenciesUser,
  
} from "../controller/emergencyController.js";

const router = express.Router();

router.post("/", createEmergency);
router.get("/", getEmergencies);
router.get("/user/:id", getEmergenciesUser);
router.get("/:id", getEmergency);
router.put("/:id", updateEmergency);
router.delete("/:id", deleteEmergency);
router.post("/notify/:userId", notifyEmergencies);

export default router;
