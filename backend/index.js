import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import socketHandler from "./socket.js";

import dotenv from "dotenv";
dotenv.config();

import { authenticate } from "./middleware/auth.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import users from "./routes/userRoutes.js";
import healthRoutes from "./routes/healthRecordRoutes.js";
import hospitalRoutes from "./routes/HospitalRoutes.js";
import appointmentRoutes from "./routes/appotmentsRoute.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import emergency from "./routes/emergencyRoutes.js"

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

global._io = io; // make io available globally
socketHandler(io);

app.use((req, res, next) => {
	req.io = global._io; // Access from global
	next();
});

// Use the routes
app.use("/api/user", users);
app.use("/api/doctors", doctorRoutes);
app.use("/api/health-records", healthRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/emergency",emergency)

app.get("/data", authenticate, (req, res) => {
	console.log(req.user);
	res.json({ user: req.user });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
