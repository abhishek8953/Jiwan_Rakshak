export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join userId room (use this in frontend after auth)
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
