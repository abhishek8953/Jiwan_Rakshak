import express from 'express';
import cookieParser from 'cookie-parser';

import dotenv from "dotenv"
dotenv.config();


import { authenticate } from './middleware/auth.js';
import doctorRoutes from './routes/doctorRoutes.js';
import users from './routes/userRoutes.js';
import healthRoutes from './routes/healthRecordRoutes.js';
import hospitalRoutes from "./routes/HospitalRoutes.js"
import appointmentRoutes from "./routes/appotmentsRoute.js"



const app = express();

// Middleware setup
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Use the routes
app.use('/api/user', users);
app.use('/api/doctors', doctorRoutes);
app.use('/api/health-records', healthRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use("/api/appointments", appointmentRoutes);



app.get('/data',authenticate,(req,res)=>{
  console.log(req.user);
  res.json({"user":req.user})
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
