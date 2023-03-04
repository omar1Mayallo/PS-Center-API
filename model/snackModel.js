import mongoose from "mongoose";

const snackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Snack name is required"],
    },
    price: {
      type: Number,
      required: [true, "Snack price is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Snack quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  {timestamps: true}
);
const Snack = mongoose.model("Snack", snackSchema);

export default Snack;
