import socketio from "socket.io-client";
import dotenv from "dotenv";
import { createContext } from "react";
import { io } from "socket.io-client";
dotenv.config();

const socket = io.connect(process.env.NEXT_PUBLIC_BASE_URL);

export { socket };
