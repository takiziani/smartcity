import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { Site } from "../sequelize/relation.js";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.YOUR_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const data = Site.findAll();
const dataText = (await data).map(site => `Name: ${site.nom}, Location: ${site.adresse}, Description: ${site.description}`).join('\n');
export default async function autoresponse(duration) {
    try {
        const prompt = `you are a travel agent based in algeria and exactly in the wilaya of boumerdes here you have a list of the most beautiful places to visit in boumerdes with there loction and description: ${dataText}. make a plan for a tourist who wants to visit most these places in ${duration} days if the duration is not provided assume its 3 days note: make sure to make the plan in this format: Day 1: Place 1, Place 2, Place 3, Day 2: Place 4, Place 5, Place 6, Day 3: Place 7, Place 8, Place 9,responde only with this format without any additional information`;
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        return result.response.text();
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
}