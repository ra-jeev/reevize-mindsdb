import { generateQuestions } from "../mindsDb";

export default defineEventHandler(async (event) => {
  console.log("incoming post event for api/generate/");

  const body = await readBody(event);
  console.log("body", body);
  if (!body.text) {
    throw createError({
      statusCode: 400,
      message: "No input text provided",
    });
  }

  let mcqCount = body.mcqCount ? parseInt(body.mcqCount) : 0;
  const trueCount = body.trueCount ? parseInt(body.trueCount) : 0;
  if (!(mcqCount + trueCount)) {
    mcqCount = 5;
  }

  try {
    const result = await generateQuestions({
      text: body.text.replaceAll("'", ""),
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
