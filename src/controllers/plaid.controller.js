import response from "../lib/response.js";
import AuthClass from "../classes/auth.class.js";
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import PlaidClass from "../classes/plaid.class.js";
import logger from "../lib/logger.js"
const PLAID_CLIENT_ID = "651f2835e34ad1001c7b0ac9"
const PLAID_SECRET = "26e7649d1eb63bc41304331bca532f"
const PLAID_PRODUCTS = ["auth", "transactions", "identity"]
const PLAID_COUNTRY_CODES = ["US"]
const PLAID_ENV = 'sandbox';
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;
let ACCOUNT_ID = null;
let PAYMENT_ID = null;
let AUTHORIZATION_ID = null;
let TRANSFER_ID = null


const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': "651f2835e34ad1001c7b0ac9",
            'PLAID-SECRET': "26e7649d1eb63bc41304331bca532f",
        },
    },
});

const plaidClient = new PlaidApi(configuration);
export const getInfo = async (req, res) => {
    try {
        res.send({
            item_id: ITEM_ID,
            access_token: ACCESS_TOKEN,
            products: PLAID_PRODUCTS,
        });
    } catch (error) {
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}

export const createLinkToken = async (req, res) => {
    try {

        const authHeader = req.get("Authorization");
        const stripStart = "Bearer ".length;
        // Strip the leading "Bearer " part from the token string
        if (stripStart && stripStart.length > 0) {
            const userIdToken = authHeader.substring(stripStart);
            // Split the user ID and token part from the rest of the token string
            const [userId, token] = userIdToken.split(",");
        }

        const plaidObj = new PlaidClass();
        const responseObj = await plaidObj.createLinkToken("mayank")

        res.send(responseObj);
    } catch (error) {
        console.log('error', error)

        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}

export const exchangePublicToken = async (req, res) => {
    try {
        const authHeader = req.get("Authorization");


        const stripStart = "Bearer ".length;
        // Strip the leading "Bearer " part from the token string
        if (stripStart && stripStart.length > 0) {
            const userIdToken = authHeader.substring(stripStart);
            // Split the user ID and token part from the rest of the token string
            const [userId, token] = userIdToken.split(",");
        }

        const publicToken = req.get("publicToken");
        console.log('public token', publicToken)
        const plaidObj = new PlaidClass();
        const responseObj = await plaidObj.exchangePublicToken("mayank", publicToken)

        res.send(responseObj);
    } catch (error) {
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}
export const getAccountData = async (req, res) => {
    try {
        logger.debug(`INFO: PlaidController-getAccountData`)

        const authHeader = req.get("Authorization");
        const stripStart = "Bearer ".length;
        if (stripStart && stripStart.length > 0) {
            const userIdToken = authHeader.substring(stripStart);
            const [userId, token] = userIdToken.split(",");
        }

        const accessToken = req.get("accessToken");
        const plaidObj = new PlaidClass();
        const responseObj = await plaidObj.getAccountData("mayank", accessToken);
        logger.debug(`RESULT: PlaidController-getAccountData - RESPONSE: ${responseObj}`)
        res.send(responseObj);
    } catch (error) {
        console.log("error", error.toString())
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}

export const getTransactionData = async (req, res) => {
    try {
        logger.debug(`INFO: PlaidController-getTransactionData`)

        const authHeader = req.get("Authorization");
        const stripStart = "Bearer ".length;

        if (stripStart && stripStart.length > 0) {
            const userIdToken = authHeader.substring(stripStart);
            const [userId, token] = userIdToken.split(",");
        }
        const accessToken = req.get("accessToken");
        const plaidObj = new PlaidClass();
        const responseObj = await plaidObj.getTransactionData("mayank", accessToken);
        // logger.debug(`RESULT: PlaidController-getTransactionData - RESPONSE: ${JSON.stringify(responseObj, null, 2)}`)

        res.send(responseObj);
    } catch (error) {
        console.log("error", error.toString())
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}

export const getRecurringTransactions = async (req, res) => {
    try {

        const authHeader = req.get("Authorization");
        console.log('GET AUTH hararar', req.body)

        const stripStart = "Bearer ".length;
        // Strip the leading "Bearer " part from the token string
        if (stripStart && stripStart.length > 0) {
            const userIdToken = authHeader.substring(stripStart);
            // Split the user ID and token part from the rest of the token string
            const [userId, token] = userIdToken.split(",");
        }


        const accessToken = req.get("accessToken");

        const plaidObj = new PlaidClass();

        const responseObj = await plaidObj.getRecurringTransactions("mayank", accessToken);

        console.log('RESPONSE PBJ ACCOUNT DATA', responseObj)
        res.send(responseObj);
    } catch (error) {
        console.log("error", error.toString())
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}

export const getIdentityInformation = async (req, res) => {
    try {

        const authHeader = req.get("Authorization");
        console.log('GET AUTH hararar', req.body)

        const stripStart = "Bearer ".length;
        // Strip the leading "Bearer " part from the token string
        if (stripStart && stripStart.length > 0) {
            const userIdToken = authHeader.substring(stripStart);
            // Split the user ID and token part from the rest of the token string
            const [userId, token] = userIdToken.split(",");
        }


        const accessToken = req.get("accessToken")

        const plaidObj = new PlaidClass();

        const responseObj = await plaidObj.getIdentityInformation("mayank", accessToken);

        console.log('RESPONSE PBJ ACCOUNT DATA', responseObj)
        res.send(responseObj);
    } catch (error) {
        console.log("error", error.toString())
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}

export const setAccessToken = async (req, res) => {
    try {
        const tokenResponse = await plaidClient.itemPublicTokenExchange({
            public_token: PUBLIC_TOKEN,
        });
        prettyPrintResponse(tokenResponse);
        ACCESS_TOKEN = tokenResponse.data.access_token;
        ITEM_ID = tokenResponse.data.item_id;
        res.send({
            // the 'access_token' is a private token, DO NOT pass this token to the frontend in your production environment
            access_token: ACCESS_TOKEN,
            item_id: ITEM_ID,
            error: null,
        });
    } catch (error) {
        res.status(500).send({
            ...response.APPLICATION_ERROR.SERVER_ERROR,
            messageObj: { error: error.toString() },
        });
    }
}

