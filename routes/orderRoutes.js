import express from "express";

import controllers from "../controllers/orderControllers.js";
import { createOrderSchema } from "../models/Order.js";
import validateBody from "../decorators/validateBody.js";

const router = express.Router();

router.post("/", validateBody(createOrderSchema), controllers.createOrder);

export default router;
