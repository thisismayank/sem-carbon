import response from "../lib/response.js";
import AuthClass from "../classes/auth.class.js";
import OpenAI from "../classes/openai.class.js";
import OpenAIClass from "../classes/openai.class.js";

export const sendTokenForEmailVerification = async (req, res) => {
    try {
        const responseObj = { body: req.body };
        const authObject = new AuthClass();
        const result = await authObject.sendTokenForEmailVerification(req.body.email.toLowerCase())

        res.send(result);
    } catch (error) {
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}

export const verifyEmailVerificationToken = async (req, res) => {
    try {
        const responseObj = { body: req.body };
        const authObject = new AuthClass();
        const result = await authObject.verifyEmailVerificationToken(req.body.email.toLowerCase(), req.body.deviceToken, req.body.verificationCode)

        res.send(result);
    } catch (error) {
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}

export const createNewAccountForUser = async (req, res) => {
    try {
        const responseObj = { body: req.body };
        const authObject = new AuthClass();
        const result = await authObject.createNewAccountForUser(req.body.email.toLowerCase(), req.body.deviceToken, req.body.firstName, req.body.lastName, req.body.referralCode)

        res.send(result);
    } catch (error) {
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}



