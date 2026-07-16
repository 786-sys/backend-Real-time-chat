import { app } from "./app.js";
import dotenv from "dotenv";
import usermodel from "./models/user.model.js";
import messagemodel from "./models/Message.model.js";
import { ConnectDB } from "./db/index.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config({
  path: "./.env",
});

// 🔹 Create HTTP server
const server = http.createServer(app);

// 🔹 Attach socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",                 // local frontend
      "https://frontend-real-time-chat.onrender.com" // deployed frontend
    ], // frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// 🔹 ONLINE USERS STORE (SOURCE OF TRUTH)
const onlineUsers = new Set(); // userId

// 🔹 Socket logic
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // 1️⃣ User joins their private room
  socket.on("join", async (userId) => {
    try {
      socket.join(userId);

      // attach userId to socket
      socket.userId = userId;

      // mark user online
      onlineUsers.add(userId);

      // broadcast online users
      io.emit("online-users", Array.from(onlineUsers));

      console.log(`🟢 User ${userId} is ONLINE`);
      await usermodel.findByIdAndUpdate(userId, {
        socketId: socket.id,
      });
    } catch (err) {
      console.error("Error in join:", err);
    }
  });

  // 2️⃣ Send message
  socket.on("send_message", async ({ senderId, receiverId, content, type, time }) => {
    try {
      console.log(
        `📩 Message from ${senderId} to ${receiverId}: ${content} with type ${type} and time ${time}  `
      );
      const newmessage = await new messagemodel({
        senderId,
        receiverId,
        content,
        type,
        status: 'sent',
        time
      }).save();

      // confirmation to sender
      io.to(senderId).emit("message_sent_confirmation", {
        id: newmessage._id,
        senderId,
        receiverId,
        content,
        type,
        status: 'sent',
        time: new Date(),
      });
      // send to receiver
      const receiveronline = onlineUsers.has(receiverId);
      if (receiveronline) {

        await messagemodel.findByIdAndUpdate(newmessage._id, {
          status: 'delivered'
        })

        io.to(receiverId).emit("receive_message", {
          id: newmessage._id,
          senderId,
          receiverId,
          content,
          type,
          status: 'delivered',
        });
      }

      // status: 'sent',
      console.log("📩 Message saved & sent");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });
  socket.on("typing", ({ senderId, receiverId }) => {
    socket.to(receiverId).emit("user_typing", { senderId });
  });
  // socket.on("read_msg",async({senderId,receiverId}) =>{
  //     socket.to(receiverId).emit("read_msg",{senderId})
  // })
  // user stopped typing
  socket.on("stop_typing", ({ senderId, receiverId }) => {
    socket.to(receiverId).emit("user_stop_typing", { senderId });
  });

  // 3️⃣ Check if a user is online (OPTIONAL)
  socket.on("is-user-online", (userId, callback) => {
    callback(onlineUsers.has(userId));
  });

  // socket.on("read_msg",async({senderId,receiverId})=>{)

  // 4️⃣ Handle disconnect
  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);

      // broadcast updated list
      io.emit("online-users", Array.from(onlineUsers));

      console.log(`🔴 User ${socket.userId} is OFFLINE`);
    }

    console.log("❌ User disconnected:", socket.id);
  });
});

// 🔹 Connect DB then start server
ConnectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`⚙️ Server running at port: ${process.env.PORT}/api/v1/User`);
      console.log(`http://localhost:${process.env.PORT || 5000}/api/v1/User`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });