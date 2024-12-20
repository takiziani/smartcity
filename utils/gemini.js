import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { Site } from "../sequelize/relation.js";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.YOUR_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const data = Site.findAll();
export default async function autoresponse(duration) {
    try {
        const prompt = `you are a travel agent based in algeria and exactly in the wilaya of boumerdes here you have a list of the most beautiful places to visit in boumerdes with there laction and description: ${data}. make a plan for a tourist who wants to visit most these places in ${duration} days`;
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        return result.response.text();
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
}