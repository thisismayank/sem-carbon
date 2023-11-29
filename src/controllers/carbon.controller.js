import CarbonClass from "../classes/carbon.class.js";
import response from "../lib/response.js";


export const placeOrder = async (req, res) => {
    try {

        const authHeader = req.get("Authorization");
        const stripStart = "Bearer ".length;
        // Strip the leading "Bearer " part from the token string
        const userIdToken = authHeader.substring(stripStart);
        // Split the user ID and token part from the rest of the token string
        const [userId, token] = userIdToken.split(",");

        const responseObj = { body: req.body };
        const carbonObject = new CarbonClass();
        const result = await carbonObject.placeOrder(userId, req.body.amountInKg)

        res.send(result);
    } catch (error) {
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}

export const getListOfOrders = async (req, res) => {
    try {

        const authHeader = req.get("Authorization");
        const stripStart = "Bearer ".length;
        // Strip the leading "Bearer " part from the token string
        const userIdToken = authHeader.substring(stripStart);
        // Split the user ID and token part from the rest of the token string
        const [userId, token] = userIdToken.split(",");

        const responseObj = { body: req.body };
        const carbonObject = new CarbonClass();
        const result = await carbonObject.getListOfOrders(userId)

        res.send(result);
    } catch (error) {
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}