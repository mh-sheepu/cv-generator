import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create a router to handle routes
const router = express.Router();

// Legacy Generate CV (placeholder/redirect)
router.post('/generate-cv', async (req, res) => {
  res.status(501).json({ error: 'Endpoint migrated. Please use /generate-from-prompt' });
});

// POST /generate-from-prompt: expects { prompt }
router.post('/generate-from-prompt', async (req, res) => {
  const { prompt } = req.body;
  try {
    const systemPrompt = `You are an expert CV parser. Extract information from the user's text and return a JSON object strictly following this structure:
    {
      "name": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "linkedin": "string",
      "github": "string",
      "website": "string",
      "dob": "string",
      "nationality": "string",
      "summaryTitle": "string",
      "summaryParagraph": "string",
      "objective": "string",
      "experience": [
        { "company": "string", "position": "string", "startDate": "string", "endDate": "string", "description": "string", "type": "string" }
      ],
      "education": [
        { "name": "string", "degree": "string", "year": "string", "result": "string" }
      ],
      "skills": ["string"],
      "certifications": ["string"],
      "languages": ["string"],
      "projects": [
        { "name": "string", "description": "string" }
      ],
      "achievements": ["string"],
      "volunteer": ["string"],
      "awards": ["string"],
      "publications": ["string"],
      "hobbies": ["string"],
      "references": "string"
    }
    
    If information is missing, use empty strings or empty arrays. Do NOT wrap the output in markdown code blocks. Return raw JSON only.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite-preview-02-05' });
    const result = await model.generateContent([systemPrompt, prompt]);
    const response = await result.response;
    const text = response.text();

    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let data;
    try {
      data = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error('Failed to parse Gemini response as JSON:', cleanJson);
      return res.status(500).json({ error: 'Gemini did not return valid JSON', details: cleanJson });
    }

    res.json(data);
  } catch (error) {
    console.error('Error generating from prompt:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to parse prompt';
    res.status(status).json({ error: message, details: error });
  }
});

// Mount router on both / and /api for Vercel compatibility
app.use('/', router);
app.use('/api', router);

const PORT = process.env.PORT || 5001;

// Only listen if not in production and not on Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

export default app;

// npm start
