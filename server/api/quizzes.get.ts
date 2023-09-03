import { authenticateRequest } from "../firebase";
import prisma from "../prisma";

export default defineEventHandler(async (event) => {
  console.log("incoming get event for api/quizzes");
  const authUser = await authenticateRequest(event);
  if (!authUser) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  try {
    const quizzes = await prisma.quiz.findMany({
      where: { creatorId: authUser.uid },
      include: { tags: true },
    });

    return {
      status: "Ok",
      result: quizzes,
    };
  } catch (error) {
    console.log("failed to update the quiz", error);
  }

  return {
    status: "Error",
    result: null,
  };
});
