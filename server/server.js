import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./databases/dbConnection.js";
import userRouter from "./routers/userInfo.js";

// Load environment variables
dotenv.config({ path: "./config/config.env" });
const port = process.env.PORT || 8000;
const app = express();
console.log("after app");
// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://portfolio-generator-xi.vercel.app",
  "https://n8q8hzm1-5173.inc1.devtunnels.ms",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman) or check if origin is in the allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Enable cookies or authorization headers
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Database Connection
dbConnection();
app.get("/", (req, res) => res.send("Welcome to the API"));

// Routes
app.use("/api/v1", userRouter);
console.log("after routes");
app.get("/api", (req, res) => {
  res.send("Hello, World!");
});
// Server
app.listen(port, function () {
  console.log("Server started at port " + port);
});
