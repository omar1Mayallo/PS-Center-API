import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Device name is required"],
      minlength: [3, "Device name minimum length 3 characters"],
      maxlength: [20, "Device name maximum length 20 characters"],
    },
    type: {
      type: String,
      trim: true,
      required: [true, "Device type is required"],
    },
    sessionType: {
      type: String,
      enum: ["Duo", "Multi"],
      default: "Duo",
    },
    multiPricePerHour: {
      type: Number,
    },
    duoPricePerHour: {
      type: Number,
    },
    startTime: {type: Date},
    endTime: {type: Date},
    totalTime: {type: Date},
    isEmpty: {
      type: Boolean,
      default: true,
    },
  },
  {timestamps: true}
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;
