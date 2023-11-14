import express from "express";
import * as controller from "../../controllers/carbon.controller.js";
const router = express.Router();


router.route("/cn/").post(controller.placeOrder);


export default router;

