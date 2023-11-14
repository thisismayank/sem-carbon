import CarbonClass from "../classes/carbon.class.js";
import response from "../lib/response.js";


export const placeOrder = async (req, res) => {
    try {
        const responseObj = { body: req.body };
        const carbonObject = new CarbonClass();
        const result = await carbonObject.placeOrder(req.body.amountInKg)

        res.send(result);
    } catch (error) {
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}