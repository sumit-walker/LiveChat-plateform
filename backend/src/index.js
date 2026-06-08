import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {connectDB} from "./lib/db.js"
import {app,server} from "./lib/socket.js"

dotenv.config();// Load environment variables from .env file
const PORT = process.env.PORT || 1000;
const __dirname=path.resolve();

app.use(cookieParser());

// Increase body limits to allow base64 image payloads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

const isDev = process.env.NODE_ENV !== "production";

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (isDev && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true;
  }
  return ["http://localhost:5173", "http://127.0.0.1:5173"].includes(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes); 

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // Express v5 no longer supports "*". Use a regex-style catch-all instead.
     app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Run: npm run free-port`);
        process.exit(1);
    }
    throw err;
});

server.listen(PORT,()=>{
    console.log("Server is runnig on port: "+PORT)
    connectDB()
})