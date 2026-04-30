import { auth } from "@AmaZon-Clone/auth";
import { env } from "@AmaZon-Clone/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

app.use("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

// API Routes
app.use("/api", apiRouter);

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

// Global Error Handler
app.use(errorHandler);

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
