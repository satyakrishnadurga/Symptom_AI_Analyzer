import { GoogleGenAI, Type } from "@google/genai";
import type { SymptomInput, AnalysisResponse } from '../types';

const PROMPT_TEMPLATE = `
You are a medical AI assistant designed to help patients understand their symptoms.
Follow these rules strictly:
- Accept as input: age, weight, symptoms (free text), and any allergies/conditions.
- Output must ALWAYS be in JSON format with the following keys:
  {
    "structured_symptoms": [
      {"name": "...", "duration_days": ..., "severity": "..."}
    ],
    "possible_causes": [
      {"condition": "...", "likelihood": 0.xx, "supporting_symptoms": ["..."], "references": ["URL1","URL2"]}
    ],
    "triage_recommendation": {
      "level": "self_care | see_primary_care | emergency",
      "reason": "..."
    },
    "medication_options": [
      {
        "name": "...",
        "rxnorm_id": "...",
        "purpose": "..."
      }
    ],
    "food_suggestions": {
        "reason": "General dietary advice based on symptoms...",
        "suggestions": ["Eat bland foods like bananas and rice.", "Stay hydrated by drinking plenty of water."]
    },
    "warnings": [
      "This tool is not a substitute for medical advice. Always consult a doctor."
    ]
  }

Guidelines:
- Do NOT invent medicines or doses. Only use standard medications relevant to the condition.
- Suggest triage level (self care / see doctor / emergency) based on symptom severity, age, and red flags.
- Based on the symptoms, provide helpful dietary suggestions that could alleviate discomfort or aid recovery.
- Always include a clear warning that this is not professional medical advice.
- It is CRITICAL that all URLs in 'references' are valid, live, and publicly accessible URLs to authoritative medical websites (e.g., Mayo Clinic, MedlinePlus, CDC, NIH, FDA). Double-check each URL to ensure it is not broken.
- If symptoms are critical (e.g., chest pain, difficulty breathing, high fever in infants), recommend **emergency**.

Now process this input:
Age: {{AGE}}
Weight: {{WEIGHT}} lbs
Symptoms: {{SYMPTOMS}}
Allergies/Conditions: {{ALLERGIES}}
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    "structured_symptoms": {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          "name": { type: Type.STRING, description: "The name of the symptom." },
          "duration_days": { type: Type.NUMBER, description: "Duration of the symptom in days." },
          "severity": { type: Type.STRING, description: "Severity of the symptom (e.g., mild, moderate, severe)." }
        },
        required: ["name", "duration_days", "severity"]
      }
    },
    "possible_causes": {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          "condition": { type: Type.STRING, description: "Name of the possible medical condition." },
          "likelihood": { type: Type.NUMBER, description: "A score from 0.0 to 1.0 indicating likelihood." },
          "supporting_symptoms": { type: Type.ARRAY, items: { type: Type.STRING }, description: "Symptoms from the input that support this diagnosis." },
          "references": { type: Type.ARRAY, items: { type: Type.STRING }, description: "Authoritative URLs for reference." }
        },
        required: ["condition", "likelihood", "supporting_symptoms", "references"]
      }
    },
    "triage_recommendation": {
      type: Type.OBJECT,
      properties: {
        "level": { type: Type.STRING, description: "One of 'self_care', 'see_primary_care', or 'emergency'." },
        "reason": { type: Type.STRING, description: "The reasoning for this triage level." }
      },
      required: ["level", "reason"]
    },
    "medication_options": {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          "name": { type: Type.STRING, description: "Name of the medication." },
          "rxnorm_id": { type: Type.STRING, description: "RxNorm Concept Unique Identifier." },
          "purpose": { type: Type.STRING, description: "What the medication is for." }
        },
        required: ["name", "rxnorm_id", "purpose"]
      }
    },
    "food_suggestions": {
        type: Type.OBJECT,
        properties: {
            "reason": { type: Type.STRING, description: "The reasoning for the food suggestions." },
            "suggestions": { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of suggested foods or dietary habits." }
        },
        required: ["reason", "suggestions"]
    },
    "warnings": {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Standard warnings and disclaimers."
    }
  },
  required: ["structured_symptoms", "possible_causes", "triage_recommendation", "medication_options", "food_suggestions", "warnings"]
};

export const analyzeSymptoms = async (input: SymptomInput): Promise<AnalysisResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = PROMPT_TEMPLATE
    .replace('{{AGE}}', input.age)
    .replace('{{WEIGHT}}', input.weight)
    .replace('{{SYMPTOMS}}', input.symptoms)
    .replace('{{ALLERGIES}}', input.allergies || 'None');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AnalysisResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("The AI returned an invalid format. Please try rephrasing your symptoms.");
    }
    throw new Error("Failed to get analysis from AI. Please try again later.");
  }
};