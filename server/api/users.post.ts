import prisma from "../prisma";

export default defineEventHandler(async (event) => {
  console.log("incoming post event for api/users/");

  const body = await readBody(event);
  console.log("body", body);

  if (!body.id || !body.name || !body.email) {
    throw createError({
      statusCode: 400,
      message: "Missing user details",
    });
  }

  const res = await prisma.user.create({
    data: {
      id: body.id,
      name: body.name,
      email: body.email,
    },
  });

  console.log("create user response", res);

  return {
    status: "Ok",
  };
});
