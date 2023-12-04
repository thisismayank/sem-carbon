import response from "../lib/response.js";
import AuthClass from "../classes/auth.class.js";
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import PlaidClass from "../classes/plaid.class.js";
import logger from "../lib/logger.js"
import OpenAIClass from "../classes/openai.class.js";


export const generateResponse = async (req, res) => {
    try {

        const authHeader = req.get("Authorization");
        const stripStart = "Bearer ".length;
        // Strip the leading "Bearer " part from the token string
        if (stripStart && stripStart.length > 0) {
            const userIdToken = authHeader.substring(stripStart);
            // Split the user ID and token part from the rest of the token string
            const [userId, token] = userIdToken.split(",");
        }

        const openAiObj = new OpenAIClass();
        const responseObj = await openAiObj.generateResponse(req.body.prompt)

        res.send(responseObj);
    } catch (error) {
        console.log('error', error)

        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}