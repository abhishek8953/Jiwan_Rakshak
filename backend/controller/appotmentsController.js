import { PrismaClient } from "@prisma/client";
import {
	createAppointmentSchema,
	updateAppointmentSchema,
	appointmentIdParamSchema,
} from "../zodSchema/appotment.schema.js";

const prisma = new PrismaClient();

const formatErrors = (err) =>
	err.issues.map((i) => ({
		path: i.path.join("."),
		message: i.message,
	}));

export const createAppointment = async (req, res) => {
	const parsed = createAppointmentSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ errors: formatErrors(parsed.error) });
	}
	try {
		const appt = await prisma.appointment.create({
			data: {
				date: new Date(parsed.data.date),
				...parsed.data,
			},
		});

		res.status(201).json(appt);
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

export const getAllAppointments = async (req, res) => {
	const appts = await prisma.appointment.findMany({
		include: { user: true, doctor: true },
	});
	res.json(appts);
};

export const getAppointmentById = async (req, res) => {
	const idp = appointmentIdParamSchema.safeParse(req.params);
	if (!idp.success)
		return res.status(400).json({ errors: formatErrors(idp.error) });

	const appt = await prisma.appointment.findUnique({
		where: { id: idp.data.id },
		include: { user: true, doctor: true },
	});
	if (!appt) return res.status(404).json({ message: "Not found" });
	res.json(appt);
};

export const getAppointmentsByUserId = async (req, res) => {
	const { userId } = req.params;
	const appts = await prisma.appointment.findMany({
		where: { userId },
		include: { doctor: true },
	});
	res.json(appts);
};

export const updateAppointment = async (req, res) => {
	const idp = appointmentIdParamSchema.safeParse(req.params);
	if (!idp.success)
		return res.status(400).json({ errors: formatErrors(idp.error) });

	const bodyp = updateAppointmentSchema.safeParse(req.body);
	if (!bodyp.success)
		return res.status(400).json({ errors: formatErrors(bodyp.error) });

	try {
		const appt = await prisma.appointment.update({
			where: { id: idp.data.id },
			data: {
				...bodyp.data,
				date: bodyp.data.date ? new Date(bodyp.data.date) : undefined,
			},
		});
		res.json(appt);
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

export const deleteAppointment = async (req, res) => {
	try {
		const idp = appointmentIdParamSchema.safeParse(req.params);
		if (!idp.success)
			return res.status(400).json({ errors: formatErrors(idp.error) });

		await prisma.appointment.deleteMany({ where: { id: idp.data.id } });
		res.status(200).json({ message: "deleted successfully" });
	} catch (error) {
		res.json({ message: error.message });
	}
};
