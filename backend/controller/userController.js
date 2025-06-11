import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";


// Zod schema for signup validation
const signupSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email format"),
	age: z
		.string()
		.min(1, "Age is required")
		.transform((val) => parseInt(val, 10)) // Convert age from string to number
		.refine((val) => !isNaN(val), "Age must be a valid number") // Ensure it's a valid number
		.superRefine((val, ctx) => {
			// Custom refinement for more complex validations
			if (val < 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Age must be a positive number",
					path: ["age"],
				});
			}
		}),
	mobile_no: z.string().min(10, "mobile number must be 10 digit"),
	address: z.string().min(1, "Address is required"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
	blood_group: z.string().min(1, "Blood group is required"),
});

// Signup Controller

export const signup = async (req, res) => {
	try {

		const parsedData = signupSchema.safeParse(req.body);
		if (!parsedData.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: parsedData.error.errors,
			});
		}

		const { name, email, age, mobile_no, address, password, blood_group } =
			req.body;

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User already exists with this email." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				age: parseInt(age),
				mobile_no: mobile_no,
				address,
				password: hashedPassword,
				blood_group,
			},
		});

		return res
			.status(201)
			.json({ message: "User registered successfully.", user });
	} catch (error) {

		return res.status(500).json({
			message: "Signup failed.",
			error: error.message,
		});
	}
};
// Login Controller
export const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		return res.status(400).json({ message: "Invalid credentials" });
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return res.status(400).json({ message: "Invalid credentials" });
	}

	// Create JWT token

	const token = jwt.sign(
		{ id: user.id, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: "1h" } // Token expires in 1 hour
	);

	// Set token in cookie
	res.cookie("auth_token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
		maxAge: 3600000, // 1 hour
	});

	return res.status(200).json({ message: "Login successful", user });
};

// Check if user is authenticated via cookies
export const checkProfile = async (req, res) => {
	try {
		const id = req.user?.id;
		const user = await prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		return res.status(200).json({ message: "Authenticated", user });
	} catch (error) {
		return res.status(401).json({
			message: "Invalid or expired token",
			error: error.message,
		});
	}
};
