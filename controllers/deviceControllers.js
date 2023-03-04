import APIError from "../utils/apiError.js";
import asyncHandler from "express-async-handler";
import Device from "../model/deviceModel.js";
import Session from "../model/sessionModel.js";

// @desc    CREATE Device
// @route   POST /api/devices
export const createDevice = asyncHandler(async (req, res, next) => {
  const doc = await Device.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      doc,
    },
  });
});
// @desc    GET All Devices
// @route   GET /api/devices
export const getAllDevices = asyncHandler(async (req, res, next) => {
  const docs = await Device.find().sort("-createdAt");
  res.status(200).json({
    status: "success",
    results: docs.length,
    data: {
      docs,
    },
  });
});
// @desc    GET Single Device
// @route   GET /api/devices/:id
export const getSingleDevice = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const doc = await Device.findById(id).select("-__v");
  //NOTFOUND Document Error
  if (!doc) {
    return next(new APIError(`There is no device match this id : ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

// @desc    UPDATE Single Device
// @route   PATCH /api/devices/:id
export const updateSingleDevice = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const doc = await Device.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  //NOTFOUND Document Error
  if (!doc) {
    return next(new APIError(`There is no device match this id : ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

// @desc    DELETE Single Device
// @route   DELETE /api/devices/:id
export const deleteSingleDevice = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const doc = await Device.findByIdAndDelete(id);
  //NOTFOUND Document Error
  if (!doc) {
    return next(new APIError(`There is no device match this id : ${id}`, 404));
  }
  res.status(204).json({
    status: "success",
  });
});

// @desc    Start Time
// @route   PATCH /api/devices/:id
export const startTimeDevice = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const {sessionType} = req.body;
  const doc = await Device.findById(id);
  //1) ERRORS
  // a) Device Not found
  if (!doc) {
    return next(new APIError(`There is no device match this id : ${id}`, 404));
  }
  // b) Device Is Not Empty
  if (!doc.isEmpty) {
    return next(new APIError(`This device is not empty now`, 400));
  }

  //2)UPDATE_DEVICE
  if (sessionType) {
    doc.sessionType = sessionType;
  }
  doc.startTime = Date.now();
  doc.isEmpty = false;
  await doc.save();

  //3)CREATE_NEW_SESSION
  const session = await Session.create({
    device: doc._id,
    type: doc.sessionType,
  });

  res.status(200).json({
    status: "success",
    data: {
      doc,
      session,
    },
  });
});

// @NOTE $unset[https://www.mongodb.com/docs/manual/reference/operator/update/unset/][https://stackoverflow.com/questions/6327893/mongodb-update-modifier-semantics-of-unset]
// @desc    RESET All Devices
// @route   PATCH /api/devices
export const resetAllDevices = asyncHandler(async (req, res, next) => {
  const doc = await Device.updateMany(
    {},
    {
      sessionType: "Duo",
      isEmpty: true,
      $unset: {["startTime"]: 1, ["endTime"]: 1},
    }
  );
  //NOTFOUND Document Error
  if (!doc) {
    return next(new APIError(`There is no device match this id : ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});
