
import { GoogleGenAI, Type } from "@google/genai";
import { AnomalyReport, BillDetails } from '../types';

// Fix: Per coding guidelines, initialize GoogleGenAI directly with process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

/**
 * Uses Gemini to extract details from a utility bill image.
 */
export const extractBillDetails = async (base64Image: string, mimeType: string): Promise<BillDetails> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: 'Analyze this utility bill. Extract the total amount due, the billing period (start and end dates or month), and the total usage (e.g., in kWh). Return the data in the specified JSON format.' },
                    { inlineData: { data: base64Image, mimeType } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        totalAmount: { type: Type.NUMBER, description: "Total amount due on the bill." },
                        billingPeriod: { type: Type.STRING, description: "The billing period, e.g., 'October 2023' or '10/01/2023 - 10/31/2023'." },
                        totalUsage: { type: Type.STRING, description: "Total usage with units, e.g., '850 kWh' or '75 CCF'." }
                    },
                    required: ["totalAmount", "billingPeriod", "totalUsage"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as BillDetails;
    } catch (error) {
        console.error("Error extracting bill details:", error);
        throw new Error("Failed to analyze the bill. Please try again with a clearer image.");
    }
};

/**
 * Uses Gemini to detect anomalies in utility usage.
 */
export const detectUsageAnomaly = async (historicalData: number[], currentUsage: number): Promise<AnomalyReport> => {
    try {
        const prompt = `
            A commercial tenant's historical monthly utility usage is: [${historicalData.join(', ')}].
            The most recent month's usage was ${currentUsage}.
            Based on the historical data, is the current usage an anomaly (e.g., a potential leak or equipment failure)?
            Please respond in the specified JSON format.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isAnomaly: { type: Type.BOOLEAN, description: "True if the current usage is considered an anomaly." },
                        reasoning: { type: Type.STRING, description: "A brief explanation for why it is or is not an anomaly." }
                    },
                    required: ["isAnomaly", "reasoning"]
                }
            }
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as AnomalyReport;
    } catch (error) {
        console.error("Error detecting anomaly:", error);
        throw new Error("Failed to perform anomaly detection.");
    }
};

/**
 * Generates title and executive summary for a dashboard presentation.
 */
export const generatePresentationContent = async (statsContext: string): Promise<{ title: string; summaryPoints: string[] }> => {
    try {
        const prompt = `
            You are a business analyst for a property management platform. 
            Based on the following dashboard statistics:
            ${statsContext}

            Please generate:
            1. A professional and engaging title for a Monthly Status Report presentation.
            2. Three concise, insightful executive summary bullet points highlighting the financial status, operations, or actions needed.

            Return the response in JSON.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Title of the presentation." },
                        summaryPoints: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "Three bullet points summarizing the status."
                        }
                    },
                    required: ["title", "summaryPoints"]
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating presentation content:", error);
        return {
            title: "Monthly Status Report",
            summaryPoints: ["Overview of financial performance.", "Operational highlights.", "Action items for the next period."]
        };
    }
};