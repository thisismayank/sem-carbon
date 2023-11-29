import response from "../lib/response.js";

export const sendEmailVerificationToken = async (req, res) => {
    try {
        const responseObj = { body: req.body };

        res.send(responseObj);
    } catch (error) {
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            version,
            messageObj: { error: error.toString() },
        });
    }
}