"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommunityChannel_1 = require("./models/CommunityChannel");
const peer_1 = require("peer");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
const socket = require("socket.io");
const nanoid_1 = require("nanoid");
dotenv_1.default.config();
const start = () => __awaiter(void 0, void 0, void 0, function* () {
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
        mongoose_1.default.set("strictQuery", true);
        yield mongoose_1.default.connect(process.env.MONGO_URI, {});
        console.log("Connected to MongoDb");
        const server = app_1.app.listen(PORT || 3000, () => {
            console.log(`Listening on port ${PORT}!`);
        });
        const io = socket(server, {
            cors: {
            // origin: ["*", "https://foxxi-frontend.vercel.app"],
            // credentials: true,
            },
        });
        const peerServer = (0, peer_1.ExpressPeerServer)(server, {
            port: 443,
            proxied: true,
            // ssl: {
            //   key: "privateKey",
            //   cert: "certificate",
            // },
            generateClientId: () => (0, nanoid_1.nanoid)(),
        });
        app_1.app.use("/peerJs", peerServer);
        let onlineUsers = new Map();
        io.on("connection", (socket) => {
            console.log("socket connected!!!!");
            console.log(socket.id);
            let chatSocket = socket;
            socket.on("hello", (data) => {
                console.log("object socker!!");
                socket.emit("error", "hello from server");
            });
            socket.on("add-user", (userId) => {
                onlineUsers.set(userId, socket.id);
            });
            socket.on("send-msg", (data) => {
                const sendUserSocket = onlineUsers.get(data.to);
                if (sendUserSocket) {
                    io.to(sendUserSocket).emit("recieve-msg", data.message);
                }
            });
            socket.on("join-room", (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
                console.log("join room emited\n");
                //check if room exists
                const room = yield CommunityChannel_1.CommunityChannel.findOne({ _id: roomId });
                if (!room)
                    return socket.emit("error", "Room does not exist in database!");
                //find number of sockets which are currently in the room
                const roomSockets = io.sockets.adapter.rooms.get(roomId);
                const numClients = roomSockets ? roomSockets.size : 0;
                if (numClients > room.maxNumbers)
                    return socket.emit("room-error", "Room is full!");
                socket.join(roomId);
                socket.broadcast.to(roomId).emit("user-connected", userId);
                socket.on("drawing-data", (data) => {
                    // console.log(data);
                    socket.broadcast.to(roomId).emit("receive-drawing-data", data);
                });
                socket.on("editor-changes", (data) => {
                    socket.broadcast.to(roomId).emit("receive-editor-data", data);
                });
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
            }));
        });
    }
    catch (err) {
        console.error(err);
    }
});
start();
