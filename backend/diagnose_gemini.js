
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    try {
        console.log('Using API Key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
        // For listing models, there isn't a direct listModels method on GenerativeModel, 
        // but we can try to instantiate a model and see or use the ModelService if accessible. 
        // Actually the SDK doesn't expose listModels in the main entry easily in older versions, 
        // but let's try to just generate content with a very standard model Name.

        const modelsToTry = [
            'gemini-1.5-flash',
            'gemini-1.5-flash-001',
            'gemini-1.5-pro',
            'gemini-pro',
            'gemini-1.0-pro'
        ];

        console.log('Testing models...');

        for (const modelName of modelsToTry) {
            console.log(`\n--- Testing ${modelName} ---`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello');
                const response = await result.response;
                console.log(`SUCCESS with ${modelName}:`, response.text());
                return; // Found one that works
            } catch (error) {
                console.error(`FAILED with ${modelName}:`, error.message);
            }
        }

        console.log('\nAll models failed.');

    } catch (error) {
        console.error('Fatal Error:', error);
    }
}

run();
