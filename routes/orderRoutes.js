import express from "express";

import controllers from "../controllers/orderControllers.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/", upload.single("file"), controllers.createOrder);

export default router;
