// src/routes/lab.routes.ts
import express from "express";
import {
  createLab,
  deleteLab,
  getLabById,
  getLabs,
  updateLab
} from "../controller/labCongroller.js";
import { checkLabSubscription } from "../middleware/checkSubscription.js";

const router = express.Router();

router.post("/", createLab);
router.get("/", getLabs);
router.get("/:id", getLabById);
router.put("/:id", updateLab);
router.delete("/:id", deleteLab);

// Example usage of middleware
router.get("/secure-data/:id", checkLabSubscription, getLabById);

export default router;
