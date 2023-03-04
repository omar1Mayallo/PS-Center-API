import APIError from "../utils/apiError.js";
import asyncHandler from "express-async-handler";
import Session from "../model/sessionModel.js";
import Snack from "../model/snackModel.js";
import Device from "../model/deviceModel.js";

// @desc    GET All Sessions
// @route   GET /api/sessions
export const getAllSessions = asyncHandler(async (req, res, next) => {
  const docs = await Session.find()
    .populate({
      path: "order.orderItems.snack",
      select: "name price",
    })
    .sort("-createdAt");
  res.status(200).json({
    status: "success",
    results: docs.length,
    data: {
      docs,
    },
  });
});
// @desc    DELETE All Sessions
// @route   DELETE /api/sessions
export const deleteAllSessions = asyncHandler(async (req, res, next) => {
  await Session.deleteMany();
  res.status(204).json({
    status: "success",
  });
});
// @desc    GET Single Session
// @route   GET /api/sessions/:id
export const getSingleSession = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const doc = await Session.findById(id).populate({
    path: "order.orderItems.snack",
  });
  //NOTFOUND Document Error
  if (!doc) {
    return next(new APIError(`There is no session match this id : ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});
// @desc    DELETE Single Session
// @route   DELETE /api/sessions/:id
export const deleteSingleSession = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const doc = await Session.findByIdAndDelete(id);
  //NOTFOUND Document Error
  if (!doc) {
    return next(new APIError(`There is no session match this id : ${id}`, 404));
  }
  res.status(204).json({
    status: "success",
  });
});
// @desc    ADD Session Order
// @route   PATCH /api/session/:id
export const addSnackSessionOrder = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const {snackId, quantity} = req.body;
  const session = await Session.findById(id);
  const snack = await Snack.findById(snackId);
  //1)ERRORS
  if (!session) {
    return next(new APIError(`There is no session match this id : ${id}`, 404));
  }
  if (!snack) {
    return next(new APIError(`There is no snack match this id : ${id}`, 404));
  }
  if (!snackId || !quantity) {
    return next(new APIError(`Please add snack and quantity`, 400));
  }
  if (quantity > snack.quantity) {
    return next(
      new APIError(`Quantity is more than the available snack quantity`, 400)
    );
  }
  //2)ADD_TO_SESSION
  //a)If Snack is already in session order, quantity++
  const snackIdx = session.order.orderItems.findIndex(
    (item) => item.snack.toString() === snackId
  );
  if (snackIdx > -1) {
    const orderItem = session.order.orderItems[snackIdx];
    if (orderItem.quantity < snack.quantity) {
      orderItem.quantity += 1;
      session.order.orderItems[snackIdx] = orderItem;
    } else {
      return next(new APIError(`Maximum quantity can you added`, 400));
    }
  } //b)If Snack is not inside session order, add it
  else {
    session.order.orderItems.push({
      snack: snackId,
      price: snack.price,
      quantity,
    });
  }

  //3)CALC_ORDER_PRICE
  let price = 0;
  session.order.orderItems.forEach((item) => {
    price += item.price * item.quantity;
  });
  session.order.orderPrice = price;
  await session.save();

  res.status(200).json({
    status: "success",
    data: {
      session,
    },
  });
});
// @desc    End Session
// @route   Patch /api/sessions/:id/end
export const endSession = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const session = await Session.findById(id);
  const device = await Device.findById(session.device);
  // console.log(device);
  //1)ERRORS
  if (!session) {
    return next(new APIError(`There is no session match this id : ${id}`, 404));
  }
  if (!device) {
    return next(new APIError(`There is no device match this id : ${id}`, 404));
  }
  if (device.isEmpty || !device.startTime) {
    return next(
      new APIError(
        `This session is not started yet, back to device to start a new session`,
        400
      )
    );
  }
  if (device.endTime) {
    return next(new APIError(`This session already ended`, 400));
  }
  //2)END_DEVICE_TIME
  device.endTime = Date.now();
  await device.save();
  //3)CALC_SESSION_HOURS
  const estimatedTimeInHours =
    (device.endTime - device.startTime) / (1000 * 60 * 60);
  //4)CALC_TOTAL_SESSION_PRICE
  const gamePrice =
    device.sessionType === "Duo"
      ? device.duoPricePerHour * estimatedTimeInHours
      : device.multiPricePerHour * estimatedTimeInHours;
  const totalSessionPrice =
    session.order.orderPrice > 0
      ? session.order.orderPrice + gamePrice
      : gamePrice;
  //5)END_SESSION
  session.estimatedTimeInHours = estimatedTimeInHours;
  session.gamePrice = gamePrice;
  session.sessionPrice = Math.round(totalSessionPrice * 100) / 100;
  await session.save();
  //6)UPDATE_SNACK_QUANTITY_SOLD
  if (session.order.orderItems.length > 0) {
    const bulkOption = session.order.orderItems.map((item) => ({
      updateOne: {
        filter: {_id: item.snack},
        update: {
          $inc: {quantity: -item.quantity, sold: +item.quantity},
        },
      },
    }));
    await Snack.bulkWrite(bulkOption);
  }
  //6)RESET_DEVICE
  device.sessionType = "Duo";
  device.startTime = undefined;
  device.endTime = undefined;
  device.isEmpty = true;
  await device.save();

  res.status(200).json({
    status: "success",
    data: {
      session,
      device,
    },
  });
});
