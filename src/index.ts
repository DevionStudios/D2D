import { CommunityChannel } from "./models/CommunityChannel";
import { ExpressPeerServer } from "peer";
import mongoose from "mongoose";
import { app } from "./app";
import dotenv from "dotenv";
const socket = require("socket.io");
import { Socket } from "socket.io";
import { nanoid } from "nanoid";
dotenv.config();

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined in .env");
    }
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined in .env");
    }
    if (!process.env.TWITTER_API_KEY) {
      throw new Error("TWITTER_API_KEY must be defined in .env");
    }
    if (!process.env.TWITTER_API_SECRET) {
      throw new Error("TWITTER_API_SECRET must be defined in .env");
    }
    if (!process.env.ACCESS_TOKEN) {
      throw new Error("ACCESS_TOKEN must be defined in .env");
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET must be defined in .env");
    }
    const PORT = process.env.PORT || 3000;

    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDb");

    const server = app.listen(PORT || 3000, () => {
      console.log(`Listening on port ${PORT}!`);
    });
    const io = socket(server, {
      cors: {
        origin: "https://foxxi-frontend.vercel.app",
        credentials: true,
      },
    });

    const peerServer = ExpressPeerServer(server, {
      // debug: true,
      port: 443,
      proxied: true,
      ssl: {
        key: "privateKey",
        cert: "certificate",
      },
      generateClientId: () => nanoid(),
    });

    let onlineUsers = new Map();
    io.on("connection", (socket: Socket) => {
      let chatSocket = socket;

      socket.on("add-user", (userId: string) => {
        onlineUsers.set(userId, socket.id);
      });

      socket.on("send-msg", (data: { to: string; message: string }) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          io.to(sendUserSocket).emit("recieve-msg", data.message);
        }
      });
      socket.on("join-room", async (roomId, userId) => {
        //check if room exists
        const room = await CommunityChannel.findOne({ _id: roomId });
        if (!room)
          return socket.emit("room-error", "Room does not exist in database!");
        //find number of sockets which are currently in the room
        const roomSockets = io.sockets.adapter.rooms.get(roomId);
        const numClients = roomSockets ? roomSockets.size : 0;
        if (numClients > room.maxNumbers)
          return socket.emit("room-error", "Room is full!");
        socket.join(roomId);
        // socket.to(roomId).broadcast.emit("user-connected", userId);
        socket.broadcast.to(roomId).emit("user-connected", userId);

        socket.on("video-off", (uId) => {
          socket.broadcast.to(roomId).emit("video-off", uId);
        });

        socket.on("video-on", (uId) => {
          socket.broadcast.to(roomId).emit("video-on", uId);
        });

        socket.on("audio-off", (uId) => {
          socket.broadcast.to(roomId).emit("audio-off", uId);
        });

        socket.on("audio-on", (uId) => {
          socket.broadcast.to(roomId).emit("audio-on", uId);
        });

        socket.on("disconnect", () => {
          socket.broadcast.to(roomId).emit("user-disconnected", userId);
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
};

start();
