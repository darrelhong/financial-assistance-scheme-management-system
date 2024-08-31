import fp from "fastify-plugin";
import fastifyJwtPlugin from "@fastify/jwt";
import fastifyAuthPlugin, { FastifyAuthFunction } from "@fastify/auth";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export default fp(
  async (fastify) => {
    fastify.register(fastifyJwtPlugin, { secret: process.env.JWT_SECRET! });
    fastify.register(fastifyAuthPlugin);

    fastify.decorate(
      "verifyJWTandUser",
      async (
        request: FastifyRequest,
        reply: FastifyReply,
        done: HookHandlerDoneFunction
      ) => {
        if (
          !request.raw.headers.auth ||
          Array.isArray(request.raw.headers.auth)
        ) {
          return done(new Error("Missing token header"));
        }

        const decoded = fastify.jwt.verify(request.raw.headers.auth) as {
          id: number;
          name: string;
        };

        request.admin = {
          id: decoded.id,
          name: decoded.name,
        };
      }
    );
  },
  { name: "auth", dependencies: ["drizzle-plugin"] }
);

declare module "fastify" {
  export interface FastifyInstance {
    verifyJWTandUser: FastifyAuthFunction;
  }
  interface FastifyRequest {
    admin: { id: number; name: string };
  }
}
