import express from 'express';
import {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
} from '../controller/medicine_reminderController.js';

const router = express.Router();

router.post('/', createReminder);
router.get('/', getReminders);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

export default router;
