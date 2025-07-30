import {PrismaClient} from "@prisma/client"


const prisma =new PrismaClient();

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
      
    // Join userId room (use this in frontend after auth)
    socket.on('join', async (userIdRaw) => {
  const userId = userIdRaw.trim();
  socket.join(userId);
 socket.data.userId = userId;
  // Send missed reminders
  const logs = await prisma.reminderLog.findMany({
    where: { userId, delivered: false },
  });

  logs.forEach(async (log) => {
    socket.emit('medicine-reminder', {
      message: log.message,
      time: log.time,
    });

    // Mark as delivered
    await prisma.reminderLog.update({
      where: { id: log.id },
      data: { delivered: true },
    });
  });

  socket.emit('join', { message: 'Joined successfully', userId });
  console.log(`User ${userId} joined room`);
});


    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
