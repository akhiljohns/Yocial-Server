import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "./src/config/connection.js";
import { Server } from "socket.io";
import http from "http";

//  IMPORTING ROUTER
import userRouter from "./src/routes/userRoutes.js";
import postRouter from "./src/routes/postRoutes.js";
import adminRouter from "./src/routes/adminRouter.js";
import authRouter from "./src/routes/authRouter.js";
import messageRouter from "./src/routes/messageRouter.js";
import socketIo_Config from "./src/services/socketIo.js";

dotenv.config();

// CONFIGURATION
const app = express();
const port = process.env.PORT || 2500;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

// db connection
const db = connect();

// path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "public");

// Serve static files from the public directory
app.use(express.static(publicPath));

// cors options
app.use(
  cors({
    origin: "*",
    method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));

// ROUTER SETUP
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/post", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

//socket connection
socketIo_Config(io);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(publicPath, "404.html"));
});

server.listen(port, () => {
  console.log(`<------------------------------------->`);
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
  console.log(`<------------------------------------->`);
});
