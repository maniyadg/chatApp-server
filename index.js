const express = require("express");
const serverless = require ('serverless-http')
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const db = require('./db/connection')
const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");
const app = express();
const socket = require("socket.io");
require("dotenv").config();


app.use(express.json());
app.use(cors({
  origin: 'https://master--prismatic-malasada-c44b26.netlify.app/',
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

db()


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT || 3003, function () {
  console.log("Server Listening!");
});


const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000/',
    credentials: true,
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
