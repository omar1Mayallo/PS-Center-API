import express from "express";
import {
  createDevice,
  getAllDevices,
  getSingleDevice,
  updateSingleDevice,
  deleteSingleDevice,
  startTimeDevice,
  resetAllDevices,
} from "../controllers/deviceControllers.js";
const router = express.Router();

router.route("/").get(getAllDevices).post(createDevice).put(resetAllDevices);

router
  .route("/:id")
  .get(getSingleDevice)
  .patch(updateSingleDevice)
  .delete(deleteSingleDevice);

router.route("/:id/start-time").patch(startTimeDevice);

export default router;
