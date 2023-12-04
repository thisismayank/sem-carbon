import BaseClass from "./base.class.js";
import OpenAI from "openai"

import axios from 'axios';
import response from "../lib/response.js";
import logger from "../lib/logger";


// Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
const apiKey = 'sk-1qVAfXRpsEzPmpeMT8vuT3BlbkFJ5Ez4TO9wLece914AP8';

export default class OpenAIClass extends BaseClass {
    async generateResponse(prompt) {
        try {
            logger.info(
                `INFO: OpenAIClass-generateResponse - Prompt: ${prompt}`
            );
            const openai = new OpenAI({
                apiKey
            });

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant designed to output JSON.",
                    },
                    { role: "user", content: prompt },
                ],
                model: "gpt-3.5-turbo",
                max_tokens: 50,
            });


            logger.debug(`RESULT: OpenAIClass-generateResponse - Prompt: ${completion.choices[0].message.content}`);

            return {
                ...response.CARBON.CNAUGHT.PLACE_ORDER.SUCCESS,
                results: {
                    completion: completion.choices[0].message.content
                }
            }
        } catch (error) {
            console.error('Error generating text:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

}

