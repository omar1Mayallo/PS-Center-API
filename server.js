//________UNCAUGHT_EXCEPTIONS________//
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception , Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
import app from "./app.js";
import connectToDB from "./config/db.js";

//________DB_CONNECTION________//
connectToDB();

//________START_SERVER________//
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(
    `App Running on PORT:${port} in ${process.env.NODE_ENV} mode`.blue.bold
  );
});

//________UNHANDLED_REJECTIONS________//
// Handle Errors (promises rejections) Outside Express [inside express we handle errors and rejections with global error middleware]
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection, Shutting Down ...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
