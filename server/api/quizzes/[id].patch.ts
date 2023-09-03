import { authenticateRequest } from "../../firebase";
import prisma from "../../prisma";

export default defineEventHandler(async (event) => {
  console.log("incoming patch event for api/quizzes/[id]");
  const authUser = await authenticateRequest(event);
  if (!authUser) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const data = await readBody(event);

  const quizId = event.context.params?.id;

  try {
    const quiz = await prisma.quiz.update({
      where: { id: quizId, creatorId: authUser.uid },
      data: {
        ...data,
      },
    });

    return {
      status: "Ok",
      result: { published: quiz.published },
    };
  } catch (error) {
    console.log("failed to update the quiz", error);
  }

  return {
    status: "Error",
    result: null,
  };
});
