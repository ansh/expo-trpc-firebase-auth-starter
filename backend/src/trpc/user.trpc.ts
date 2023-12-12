import { z } from "zod";
import { router, privateProcedure } from "./trpc";
import prisma from "../config/prisma";
import { TRPCError } from "@trpc/server";

const userRouter = router({
  createNewUserIfRequired: privateProcedure.mutation(async ({ ctx, input }) => {
    const uid = ctx.user.uid;
    const phoneNumber = ctx.user.phoneNumber;
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          id: uid,
        },
      });
      if (existingUser) {
        return {
          message: "User already exists",
          data: existingUser,
          isNew: false,
        };
      }
      const createdUser = await prisma.user.create({
        data: {
          id: uid,
          phoneNumber: phoneNumber,
        },
      });
      return {
        message: "User created",
        data: createdUser,
        isNew: true,
      };
    } catch (e) {
      throw new TRPCError({
        message: "Unable to create user",
        code: "INTERNAL_SERVER_ERROR",
        cause: e,
      });
    }
  }),
  getCurrentUser: privateProcedure.query(async ({ ctx }) => {
    const uid = ctx.user.uid;
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: uid,
        },
      });
      return user;
    } catch (e) {
      throw new TRPCError({
        message: "User not found",
        code: "BAD_REQUEST",
        cause: e,
      });
    }
  }),
});

export default userRouter;
