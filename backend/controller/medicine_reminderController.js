import prisma from '../config/db.js';
import cron from 'node-cron';
import { reminderSchema } from '../zodSchema/reminder.scema.js';

const activeReminders = new Map(); // for storing scheduled tasks

function scheduleReminder(reminder, io) {
  const { times, repeat, name, userId, id } = reminder;

  times.forEach((time, index) => {
    const [hour, minute] = time.split(':');
    let cronExp = `${minute} ${hour} * * *`;

    if (repeat === 'WEEKLY') cronExp = `${minute} ${hour} * * 1`; // every Monday
    if (repeat === 'ONCE') {
      const date = new Date(reminder.startDate);
      cronExp = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
    }

    const task = cron.schedule(cronExp, async () => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        io.to(userId).emit('medicine-reminder', {
          message: `Reminder for ${name}`,
          time,
        });
      }
    });

    activeReminders.set(`${id}-${index}`, task);
  });
}

export const createReminder = async (req, res) => {
  try {
    const parse = reminderSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error });

    const reminder = await prisma.medicineReminder.create({
      data: req.body,
    });

    scheduleReminder(reminder, req.io); // attach socket.io from middleware
    res.json({ reminder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReminders = async (req, res) => {
  try {
    const reminders = await prisma.medicineReminder.findMany();
    res.json({ reminders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateReminder = async (req, res) => {
  const { id } = req.params;
  try {
    const parse = reminderSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error });

    // Stop previous tasks
    for (let [key, task] of activeReminders.entries()) {
      if (key.startsWith(id)) {
        task.stop();
        activeReminders.delete(key);
      }
    }

    const reminder = await prisma.medicineReminder.update({
      where: { id },
      data: req.body,
    });

    scheduleReminder(reminder, req.io);
    res.json({ reminder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteReminder = async (req, res) => {
  const { id } = req.params;
  try {
    for (let [key, task] of activeReminders.entries()) {
      if (key.startsWith(id)) {
        task.stop();
        activeReminders.delete(key);
      }
    }

    await prisma.medicineReminder.delete({ where: { id } });
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
