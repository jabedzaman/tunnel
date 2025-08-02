import express from "express";
import type { Express } from "express";
import cors from "cors";
import http from "node:http";
import cookieParser from "cookie-parser";
import { errorHandler, loggerMiddleware, notFoundHandler } from "~/middlewares";
import { router } from "./routes";

/**
 * @description express app
 */
export const app: Express = express();

// Middleware

app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow cookies to be sent
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Additional configurations
app.set("json spaces", 2); // Set JSON response indentation

// Attach Logging middleware
app.use(loggerMiddleware);

// Attach routes
app.use(router);

// Not found handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

/**
 * @description create http server
 */
export const createHttpServer = () => {
  const server = http.createServer(app);
  return server;
};
