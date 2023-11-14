import response from "../lib/response.js";
import AuthClass from "../classes/auth.class.js";
export const sendTokenForEmailVerification = async (req, res) => {
    try {
        const responseObj = { body: req.body };
        const authObject = new AuthClass();
        const result = await authObject.sendTokenForEmailVerification(req.body.email)

        res.send(responseObj);
    } catch (error) {
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            version,
            messageObj: { error: error.toString() },
        });
    }
}