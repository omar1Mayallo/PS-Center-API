import express from "express";
import {
  createSnack,
  getAllSnacks,
  getSingleSnack,
  updateSingleSnack,
  deleteSingleSnack,
} from "../controllers/snackControllers.js";
const router = express.Router();

router.route("/").get(getAllSnacks).post(createSnack);
router
  .route("/:id")
  .get(getSingleSnack)
  .patch(updateSingleSnack)
  .delete(deleteSingleSnack);

export default router;
