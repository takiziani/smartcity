import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { Site } from "../sequelize/relation.js";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.YOUR_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const data = Site.findAll();
const dataText = (await data).map(site => `Name: ${site.nom}, Location: ${site.adresse}, Description: ${site.description}`).join('\n');
export default async function autoresponse(message) {
    try {
        const prompt = `you are a travel agent based in algeria and exactly in the wilaya of boumerdes here you have a list of the most beautiful places to visit in boumerdes with there loction and description: ${dataText}. answer the following message ${message} based on the list of places to visit in boumerdes`;
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        return result.response.text();
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
}