import express from 'express';
const router = express.Router();
import { signup, login, checkProfile } from '../controller/userController.js';
import { authenticate } from '../middleware/auth.js';

router.post('/signup', signup);  // Signup route
router.post('/login', login);     // Login route
router.get('/profile', authenticate,checkProfile); // Route to check if user is authenticated

export default router;
