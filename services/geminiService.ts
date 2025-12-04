import { GoogleGenAI } from "@google/genai";
import { ShapeType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMathProblem = async (shape: ShapeType | 'ALL') => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    請你扮演一位台灣的小學五年級數學老師。
    請針對「${shape === 'ALL' ? '平行四邊形、三角形和梯形的面積' : shape + '的面積'}」這個主題，
    出一個適合五年級學生的應用題（Word Problem）。
    
    要求：
    1. 題目情境要生活化（例如：花圃、色紙、土地面積等）。
    2. 數字設計要簡單好算，不要有太複雜的小數。
    3. 請使用繁體中文（台灣用語）。
    4. 不要直接給出答案，要在題目後方附上一個「提示」，引導學生思考如何使用公式。
    5. 最後再附上「解答」與詳細計算過程，但請將解答用特殊的標記包起來，例如 <answer>...</answer>，以便前端隱藏。
    
    格式範例：
    題目：...
    
    提示：...
    
    <answer>
    解答：...
    </answer>
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Simple task, no extensive thinking needed
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating problem:", error);
    return "抱歉，老師現在有點忙，請稍後再試一次。（連線錯誤）";
  }
};

export const checkAnswer = async (question: string, studentAnswer: string) => {
   const modelId = "gemini-2.5-flash";
   const prompt = `
    你是一位台灣的小學數學老師。
    
    題目是：
    ${question}
    
    學生的回答是：
    ${studentAnswer}
    
    請判斷學生的回答是否正確，或是觀念哪裡有錯。
    請給予溫暖、鼓勵性質的回饋。如果答錯了，請引導他正確的算法。
   `;

   try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error checking answer:", error);
    return "老師還在改考卷中...（連線錯誤）";
  }
};
