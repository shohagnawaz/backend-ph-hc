import express, { Application, NextFunction, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { SpecialtyRoutes } from "./app/module/specialty/specialty.route";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandller";
import { notFound } from "./app/middleware/notFound";
import AppError from "./app/errorHelpers/AppError";
import status from "http-status";
import cookieParser from "cookie-parser";

const app : Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", IndexRoutes);

// Basic route
app.get('/', async (req: Request, res: Response) => {

  throw new AppError(status.BAD_REQUEST, "Just testing error handler");

  res.status(201).json({
    success: true,
    message: "API is working",
    data: specialty
  });
});

app.use(globalErrorHandler);
app.use(notFound)

export default app;