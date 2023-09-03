import { generateQuestions, type QuestionsRequest } from "../mindsDb";

export default defineEventHandler(async (event) => {
  console.log("incoming post event for api/generate/");

  const body = (await readBody(event)) as QuestionsRequest;
  console.log("body", body);
  if (!body.text) {
    throw createError({
      statusCode: 400,
      message: "No input text provided",
    });
  }

  let mcqCount = body.mcqCount || 0;
  const trueCount = body.trueCount || 0;
  if (!(mcqCount + trueCount)) {
    mcqCount = 5;
  }

  try {
    const result = await generateQuestions({
      text: body.text,
      mcqCount,
      trueCount,
    });

    return {
      status: "Ok",
      result,
    };
  } catch (error) {
    console.log("Failed to generate questions", error);
    return {
      status: "Error",
    };
  }
});
