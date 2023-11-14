import axios from "axios";
import logger from "../lib/logger";

const CNAUGHT_API_KEY = "C0-sandbox-6J5dYLSF6lwPFdpc02cLcqjrlyYM1xujR";

export const placeOrder = async (amountInKg) => {
    try {
        logger.info(`INFO: CNaught-placeOrder: ${amountInKg}`);

        const headers = {
            'Authorization': `Bearer ${CNAUGHT_API_KEY}`,
            "Content-Type": "application/json"
        }

        const placeOrderUrl = "https://api.cnaught.com/v1/orders"
        const body = {
            amount_kg: amountInKg, metadata: "This is a test"
        }

        const response = await axios.post(placeOrderUrl, body, { headers });

        logger.debug(`RESULT: CNaught-placeOrder: STATUS: ${response.status} - DATA: ${JSON.stringify(response.data)}`);
        if (response.status == 201) {
            return {
                status: true,
                type: response.data.type,
                id: response.data.id,
                amountInKg: response.data.amount_kg,
                state: response.data.state,
                certificateUrl: response.data.certificate_public_url,
                downloadCertificateUrl: response.data.certificate_download_public_url
            }
        }

    } catch (error) {
        logger.error(`ERROR: CNaught-placeOrder: ${error}`);
        throw error;
    }
}