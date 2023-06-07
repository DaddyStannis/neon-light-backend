import HttpError from "../helpers/HttpError.js";
import controlWrapper from "../decorators/controlWrapper.js";
import Order from "../models/Order.js";

async function createOrder(req, res) {
  const result = await Order.create(req.body);
  res.json();
}

export default { createOrder: controlWrapper(createOrder) };
