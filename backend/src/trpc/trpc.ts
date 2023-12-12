import { initTRPC, inferAsyncReturnType, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { firebaseAuth } from "../config/firebase";

// created for each request
export const createContext = async ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  return {
    req,
    res,
  };
}; // context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create(); // initialize trpc (must be done once)
// Reusable middleware that checks if users are authenticated.
const isAuthenticated = t.middleware(async ({ next, ctx }) => {
  let uid, phoneNumber;
  if (ctx.req.headers.authorization) {
    const auth_jwt = ctx.req.headers.authorization.split(" ")[1];
    try {
      const decodedToken = await firebaseAuth.verifyIdToken(auth_jwt);
      // console.log("decodedToken", decodedToken);
      if (decodedToken) {
        uid = decodedToken.uid;
        if (decodedToken.phone_number) {
          phoneNumber = decodedToken.phone_number;
        }
        console.log(`@trpc middleware ${decodedToken.uid}`);
      }
      if (!uid || !phoneNumber)
        throw new TRPCError({ code: "BAD_REQUEST", message: "User does not exist" }); // if no uid or phoneNumber this must be a bad request
      return next({
        ctx: {
          ...ctx,
          user: {
            uid: uid,
            phoneNumber: phoneNumber,
          },
        },
      });
    } catch (e) {
      console.error("@trpc middleware", e);
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid auth token provided",
      });
    }
  } else {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No auth token provided",
    });
  }
});
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthenticated);
