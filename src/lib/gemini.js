import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY environment variable is not set. Gemini API calls will fail.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

const quizScoreSchema = {
  type: SchemaType.OBJECT,
  properties: {
    score: {
      type: SchemaType.NUMBER,
      description: "The user's score on the quiz, out of 10.",
    },
    results: {
      type: SchemaType.ARRAY,
      description: "An array of objects, one for each question, indicating whether the user's answer was correct.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: {
            type: SchemaType.STRING,
            description: "The question that was asked.",
          },
          user_answer: {
            type: SchemaType.STRING,
            description: "The answer the user provided.",
          },
          acceptable_answers: {
            type: SchemaType.ARRAY,
            description: "A list of acceptable answers for the question.",
            items: {
              type: SchemaType.STRING,
            },
          },
          correct: {
            type: SchemaType.BOOLEAN,
            description: "Whether the user's answer was correct.",
          },
        },
        required: ["question", "user_answer", "acceptable_answers", "correct"],
      },
    },
  },
  required: ["score", "results"],
};

export async function scoreQuiz(quizData) {
  if (!GEMINI_API_KEY) {
    console.error("Cannot score quiz: GEMINI_API_KEY is not set.");
    return null;
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
      responseSchema: quizScoreSchema,
    },
  });

  const prompt = `
    You are an expert grader for the US Citizenship Test. Score the following quiz and provide feedback.
    The user was asked 10 questions. For each question, the user's answer is provided, along with a list of acceptable answers.
    Determine if the user's answer is correct. The user's answer does not need to be a verbatim match, but it must be substantively correct.
    Calculate the total score out of 10.

    Quiz data:
    ${JSON.stringify(quizData, null, 2)}

    Provide the score and results in the specified JSON format.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    
    try {
      // First attempt to parse directly
      return JSON.parse(responseText);
    } catch (parseError) {
      console.warn("Initial JSON parse failed, attempting to clean response.", parseError);
      
      // Attempt to extract JSON from markdown ```json ... ``` block
      const match = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (match && match[1]) {
        try {
          console.log("Found JSON in markdown block, attempting to parse extracted content.");
          return JSON.parse(match[1]);
        } catch (fallbackParseError) {
          console.error("Failed to parse extracted JSON.", fallbackParseError);
          console.error("Raw extracted text:", match[1]);
        }
      }
      
      // If all parsing fails, log the original response and throw
      console.error("Could not parse Gemini response as JSON, even after cleaning.");
      console.error("Raw Gemini response text:", responseText);
      throw new Error("Failed to parse Gemini response.");
    }
  } catch (error) {
    console.error('Error calling Gemini API or processing response:', error);
    return null;
  }
}