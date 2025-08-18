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
const PORT = process.env.PORT;
const __dirname=path.resolve();

// Enable CORS as early as possible so even error responses include headers
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

app.use(cookieParser());

// Increase body limits to allow base64 image payloads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes); 

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // Express v5 no longer supports "*". Use a regex-style catch-all instead.
    app.get("*)", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}


server.listen(PORT,()=>{
    console.log("Server is runnig on port: "+PORT)
    connectDB()
})