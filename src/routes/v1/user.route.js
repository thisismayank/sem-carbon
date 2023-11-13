import express from "express";
import * as controller from "../../controllers/user.controller.js";
const router = express.Router();

router.route("/email").post(controller.sendEmailVerificationToken);

router.route("/email/verify").post();

router.route("/").post();

export default router;

