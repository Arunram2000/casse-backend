import express, { NextFunction, Response, Request as ExpressRequest } from "express";
import http from "http";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import dotConfig from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import router from "./routes";

import connectDB from "./db/connetMongo";
import { config } from "./config";
import { swaggerSpec } from "./config/swagger";
import logger from "./utils/logger";

import fetch, { Request } from "node-fetch";
(globalThis as any).fetch = fetch;
(globalThis as any).Request = Request;

dotConfig.config();

const app = express();
const server = http.createServer(app);
const PORT = config.PORT;
const HOST = "0.0.0.0";
app.use(cookieParser());
app.use(express.json());
app.use(helmet(
  {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        mediaSrc: ["'self'", "http:", "https:", "data:", "blob:"],
      },
    },
  }
));
app.use(compression());

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    exposedHeaders: "Authorization",
  })
);

app.use((req, _res, next) => {
  console.log(
    req.url || "NO_URL",
    req.method,
    req.get("Origin") || "NO_ORIGIN",
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "NO_IP",
    new Date()
  );
  next();
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "Casse App API Documentation",
  })
);
// Serve static files from the 'public' directory
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/api/v1/songs", (_req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // Allows usage from other origins
  next();
});
app.use("/api/v1/songs", express.static(path.join(process.cwd(), "songs")));

app.use("/api/v1", router);

app.get("/", (_req, res) => {
  res.send({
    message: "Welcome to Casse App API",
    version: "1.0.0",
  });
});

app.all("/*", (_req, res: Response) => {
  res.status(404).send({
    errno: 404,
    message: "Endpoint not found",
    type: "INVALID_ENDPOINT",
  });
});

app.use((err: Error, _req: ExpressRequest, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

server.listen(PORT, HOST, () => {
  logger.info(`Server is running on http://${HOST}:${PORT}`);
  connectDB();
});
