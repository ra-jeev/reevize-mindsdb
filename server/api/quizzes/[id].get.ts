import { authenticateRequest } from "../../firebase";
import prisma from "../../prisma";

export default defineEventHandler(async (event) => {
  console.log("incoming get event for api/quizzes/[id]");

  const authUser = await authenticateRequest(event);

  const res = await prisma.quiz.findUnique({
    where: {
      id: event.context.params?.id!,
      AND: { OR: [{ published: true }, { creatorId: authUser?.uid }] },
    },
    include: { questions: true, creator: true, tags: true },
  });

  return {
    status: "Ok",
    result: res,
  };
});
