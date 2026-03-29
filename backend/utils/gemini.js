const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateTestCases(url, method, description) {
  const prompt = `
Generate API test cases for the following endpoint:
URL: ${url}
Method: ${method}
Description or Request Body: ${description}

STRICT OUTPUT FORMAT (VERY IMPORTANT):
Return ONLY valid JSON array with the following structure, and NO markdown formatting or backticks:
[
  {
    "name": "Valid Request",
    "input": { "key": "value" },
    "expectedStatus": 200
  }
]
Include edge cases like empty fields, invalid formats, large inputs, incorrect data types.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
    });
    
    let text = response.text;
    // Strip markdown formatting if any
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim();
    }
    // Also remove backticks anywhere if they enclose the whole text
    text = text.replace(/^\`\`\`(json)?/m, '').replace(/\`\`\`$/m, '').trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate test cases or parse Gemini response.");
  }
}

async function explainFailure(url, method, input, expectedStatus, actualStatus, actualResponse) {
  const prompt = `
An API test failed.
URL: ${url}
Method: ${method}
Input: ${JSON.stringify(input)}
Expected Status: ${expectedStatus}
Actual Status: ${actualStatus}
Actual Response: ${JSON.stringify(actualResponse)}

Return ONLY valid JSON with no markdown formatting:
{
  "explanation": "short explanation of failure",
  "fixSuggestion": "possible fix suggestion"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
    });
    let text = response.text;
    text = text.replace(/^\`\`\`(json)?/m, '').replace(/\`\`\`$/m, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Explanation Error:", error);
    return {
      explanation: "Could not generate explanation.",
      fixSuggestion: "Check server logs or verify endpoint."
    };
  }
}

module.exports = { generateTestCases, explainFailure };
