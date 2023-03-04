import express from "express";
import {
  getAllSessions,
  getSingleSession,
  deleteSingleSession,
  deleteAllSessions,
  addSnackSessionOrder,
  endSession,
} from "../controllers/sessionControllers.js";
const router = express.Router();

router.route("/").get(getAllSessions).delete(deleteAllSessions);

router
  .route("/:id")
  .get(getSingleSession)
  .delete(deleteSingleSession)
  .patch(addSnackSessionOrder);

router.route("/:id/end").patch(endSession);

export default router;
