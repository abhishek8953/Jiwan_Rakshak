import express from "express";
import upload from "../config/cludinary.js";
import {
	createHealthRecord,
	getAllHealthRecords,
	getHealthRecordById,
	updateHealthRecord,
	deleteHealthRecord,
	getHRByUser,
} from "../controller/healthRecordController.js";

const router = express.Router();

router.post("/", upload.single("file"), createHealthRecord);
router.get("/", getAllHealthRecords);
router.get("/:id", getHealthRecordById);
router.put("/:id", upload.single("file"), updateHealthRecord);
router.get("/user/:userId", getHRByUser);
router.delete("/:id", deleteHealthRecord);

export default router;
