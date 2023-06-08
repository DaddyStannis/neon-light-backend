import express from "express";

import controllers from "../controllers/orderControllers.js";
import { createOrderSchema } from "../models/Order.js";
import validateBody from "../decorators/validateBody.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/",
  upload.single("file"),
  validateBody(createOrderSchema),
  controllers.createOrder
);

export default router;
