import asyncHandler from "express-async-handler";
import { generateAIResponse } from "../config/gemini.js";

const buildPrompt = ({ type, subject, topic, examDate, notesText }) => {
  const baseInstruction = `
You are Cramly AI, a helpful exam preparation assistant for college students.
Use simple English.
Use clear headings.
Give practical exam-focused output.
Avoid unnecessary long theory.
`;

  if (type === "roadmap") {
    return `
${baseInstruction}

Task: Create a last-minute study roadmap.

Subject: ${subject || "Not provided"}
Topic/Exam input: ${topic || "Not provided"}
Exam date/deadline: ${examDate || "Not provided"}

Make output in this format:
1. Quick Summary
2. Priority Topics
3. Day-wise / Hour-wise Study Plan
4. Revision Strategy
5. Important Tips
6. What to avoid
`;
  }

  if (type === "questions") {
    return `
${baseInstruction}

Task: Generate important exam questions.

Subject: ${subject || "Not provided"}
Topic: ${topic || "Not provided"}
Notes/context:
${notesText || "No notes provided"}

Make output in this format:
1. Very Important Questions
2. Short Answer Questions
3. Long Answer Questions
4. Viva Questions
5. Most Repeated PYQ-style Questions
`;
  }

  if (type === "explain") {
    return `
${baseInstruction}

Task: Explain this topic like teaching a beginner.

Subject: ${subject || "Not provided"}
Topic: ${topic || "Not provided"}
Context:
${notesText || "No extra context"}

Make output in this format:
1. Simple Meaning
2. Real-life Example
3. Step-by-step Explanation
4. Key Points to Remember
5. Common Exam Mistakes
`;
  }

  if (type === "quiz") {
    return `
${baseInstruction}

Task: Create a quiz.

Subject: ${subject || "Not provided"}
Topic: ${topic || "Not provided"}
Context:
${notesText || "No notes provided"}

Generate:
- 10 MCQs
- 4 options each
- Correct answer after each question
- 1-line explanation
`;
  }

  if (type === "flashcards") {
    return `
${baseInstruction}

Task: Create study flashcards.

Subject: ${subject || "Not provided"}
Topic: ${topic || "Not provided"}
Context:
${notesText || "No notes provided"}

Generate 15 flashcards in this format:
Q: question
A: short answer
`;
  }

  return `
${baseInstruction}

Subject: ${subject || "Not provided"}
Topic: ${topic || "Not provided"}
Context:
${notesText || "No notes provided"}
`;
};

export const generateStudyContent = asyncHandler(async (req, res) => {
  const { type, subject, topic, examDate, notesText } = req.body;

  if (!type) {
    res.status(400);
    throw new Error("AI tool type is required");
  }

  const prompt = buildPrompt({
    type,
    subject,
    topic,
    examDate,
    notesText,
  });

  const result = await generateAIResponse(prompt);

  res.status(200).json({
    success: true,
    message: "AI content generated successfully",
    result,
  });
});