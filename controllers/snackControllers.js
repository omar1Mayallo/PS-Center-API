import APIError from "../utils/apiError.js";
import asyncHandler from "express-async-handler";
import Snack from "../model/snackModel.js";

// @desc    CREATE Snack
// @route   POST /api/snacks
export const createSnack = asyncHandler(async (req, res, next) => {
  const doc = await Snack.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      doc,
    },
  });
});

// @desc    GET All Snacks
// @route   GET /api/snacks
export const getAllSnacks = asyncHandler(async (req, res, next) => {
  const docs = await Snack.find();
  res.status(200).json({
    status: "success",
    results: docs.length,
    data: {
      docs,
    },
  });
});

// @desc    GET Single Snack
// @route   GET /api/snacks/:id
export const getSingleSnack = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const doc = await Snack.findById(id).select("-__v");
  //NOTFOUND Document Error
  if (!doc) {
    return next(new APIError(`There is no snack match this id : ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

// @desc    UPDATE Single Snack
// @route   PATCH /api/snacks/:id
export const updateSingleSnack = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const doc = await Snack.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  //NOTFOUND Document Error
  if (!doc) {
    return next(new APIError(`There is no snack match this id : ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

// @desc    DELETE Single Snack
// @route   DELETE /api/snacks/:id
export const deleteSingleSnack = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const doc = await Snack.findByIdAndDelete(id);
  //NOTFOUND Document Error
  if (!doc) {
    return next(new APIError(`There is no snack match this id : ${id}`, 404));
  }
  res.status(204).json({
    status: "success",
  });
});
