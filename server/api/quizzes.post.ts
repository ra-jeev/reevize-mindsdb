import { createId } from "@paralleldrive/cuid2";
import { authenticateRequest } from "../firebase";
import prisma from "../prisma";

// admin.initializeApp();

export default defineEventHandler(async (event) => {
  console.log("incoming post event for api/quizzes/");

  const authUser = await authenticateRequest(event);
  if (!authUser) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  console.log("authenticated user", authUser);

  const body = await readBody(event);
  console.log("body", body);

  const quizData: any = {
    id: createId(),
    name: body.name,
    description: body.description,
    published: body.published,
    creatorId: authUser.uid,
  };

  if (body.tags) {
    const tags = [];
    for (const tag of body.tags) {
      tags.push({
        where: { name: tag },
        create: { name: tag },
      });
    }

    quizData.tags = {
      connectOrCreate: tags,
    };
  }

  if (body.questions) {
    const questions = body.questions.map((question: any) => ({
      ...question,
      contentId: body.contentId,
    }));

    quizData.questions = {
      create: questions,
    };
  }

  const createRes = await prisma.quiz.create({ data: quizData });
  console.log("quiz create response", createRes);

  return {
    status: "Ok",
    result: createRes,
  };
});
