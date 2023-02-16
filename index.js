const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const db = require('./db/connection')
const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'https://master--fastidious-daffodil-71caa8.netlify.app'
}));

db()


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT || 3003, function () {
  console.log("Server Listening!");
});
const io = socket(server, {
  cors: {
    origin: 'https://master--fastidious-daffodil-71caa8.netlify.app'
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});