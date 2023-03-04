import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: [true, "Session must belong to a certain device"],
    },
    type: {
      type: String,
      required: [true, "Session must have a type"],
    },
    estimatedTimeInHours: {
      type: Number,
      set: (val) => Math.round(val * 100) / 100,
    },
    gamePrice: {
      type: Number,
      set: (val) => Math.round(val * 100) / 100,
    },
    order: {
      orderItems: [
        {
          snack: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Snack",
          },
          price: Number,
          quantity: Number,
        },
      ],
      orderPrice: {
        type: Number,
      },
    },
    sessionPrice: {
      type: Number,
    },
  },
  {timestamps: true}
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
