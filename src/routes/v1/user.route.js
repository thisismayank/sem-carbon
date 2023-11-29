import express from "express";
import * as controller from "../../controllers/auth.controller.js";
const router = express.Router();

router.route("/email").post(controller.sendTokenForEmailVerification);

router.route("/email/verify").post(controller.verifyEmailVerificationToken);

router.route("/").post(controller.createNewAccountForUser);


export default router;

