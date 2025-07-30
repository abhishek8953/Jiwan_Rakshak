import { io } from 'socket.io-client';

const socket = io("http://localhost:3000"); // Your backend URL

socket.on("connect", () => {
  console.log("Connected to socket server");

  const userId = "4b479ae4-b51e-4909-bfc0-c72bae76b1c9";
  socket.emit("join", userId); // ✅ Join userId room
});

// ✅ Listen for reminder
socket.on("reminder", (data) => {
  console.log("Received reminder:", data.message);
  alert(data.message); // or show notification
});
