import express from "express";

import controllers from "../controllers/orderControllers.js";
import { createOrderSchema } from "../models/Order.js";
import validateBody from "../decorators/validateBody.js";
import { upload, destroySingleFile } from "../middlewares/storage.js";

const router = express.Router();

router.post(
  "/",
  upload.single("file"),
  validateBody(createOrderSchema),
  controllers.createOrder,
  destroySingleFile // deleting the image from the cloud if the validation fails
);

export default router;
