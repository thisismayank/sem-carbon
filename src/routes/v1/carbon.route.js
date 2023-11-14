import express from "express";
import * as controller from "../../controllers/carbon.controller.js";

import { authorize } from "../../middleware/authorize.js";
const router = express.Router();


router.route("/cn/").post(authorize, controller.placeOrder);


export default router;

