import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import _ from "colors";
import APIError from "./utils/apiError.js";
import globalErrorMiddleware from "./middlewares/globalErrorMiddleware.js";
import cors from "cors";
import deviceRouter from "./routes/deviceRouter.js";
import sessionRouter from "./routes/sessionRouter.js";
import snacksRouter from "./routes/snacksRouter.js";

//__________CONFIG.ENV____________//
dotenv.config();

//__________ExpressApp____________//
const app = express();

//_________ENABLE_CROSS_ORIGIN_RESOURCES_SHARING_________//
app.use(cors());
app.options("*", cors());

//__________MIDDLEWARES____________//
// 1) morgan (requests logger)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// 2) body parser (The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser)
app.use(express.json());

//__________ROUTERS____________//
// 1) App Routes
app.use("/api/devices", deviceRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/snacks", snacksRouter);

// 2) NotFound Routes
app.all("*", (req, res, next) => {
  next(new APIError(`Cant find ${req.originalUrl} on this server`, 404));
});

//__________GLOBAL_ERROR_MIDDLEWARE____________//
app.use(globalErrorMiddleware);

export default app;
