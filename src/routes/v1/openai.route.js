import express from "express";
import * as controller from "../../controllers/openai.controller.js";
const router = express.Router();

router.route("/").post(controller.generateResponse);

export default router;