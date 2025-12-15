
import { GoogleGenAI, Modality } from "@google/genai";
import { ApiKeyData } from "../types";

interface GenerateSpeechParams {
  text: string;
  voiceId: string;
  speed: number;
  pitch: number;
  isSSML: boolean;
}

const LOCAL_STORAGE_KEY = 'gemini_api_keys_v2'; // Changed key to avoid conflict/force migration

// Helper to migrate old single key to new list format
function migrateOldKey(): ApiKeyData[] {
  const oldKey = localStorage.getItem('gemini_api_key');
  if (oldKey) {
    const newEntry: ApiKeyData = {
      key: oldKey,
      status: 'active',
      usageCount: 0,
      addedAt: Date.now()
    };
    localStorage.removeItem('gemini_api_key');
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newEntry]));
    return [newEntry];
  }
  return [];
}

export function getStoredApiKeys(): ApiKeyData[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }
  return migrateOldKey();
}

export function saveStoredApiKeys(keys: ApiKeyData[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(keys));
}

// Hàm generateSpeech bây giờ nhận apiKey cụ thể để thực hiện request
export async function generateSpeech({ text, voiceId, speed, pitch, isSSML }: GenerateSpeechParams, apiKey: string): Promise<string> {
  let promptText = text;

  if (!isSSML) {
    const sanitizedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    promptText = `<speak><prosody rate="${speed.toFixed(2)}" pitch="${pitch}st">${sanitizedText}</prosody></speak>`;
  }

  if (!apiKey) {
    throw new Error("No API Key provided for this request.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceId },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data received from the API.");
    }

    return base64Audio;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Phân loại lỗi để App xử lý trạng thái key
    const errString = error.toString();
    if (errString.includes('429') || errString.includes('Quota')) {
        throw new Error("QUOTA_EXCEEDED");
    }
    if (errString.includes('403') || errString.includes('API key')) {
         throw new Error("INVALID_KEY");
    }
    throw new Error(error.message || "Unknown error during generation");
  }
}
