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
        const { token } = request.cookies;
        if (!token) {
          return done(new Error("Missing token cookie"));
        }

        const decoded: any = await new Promise((resolve, reject) => {
          fastify.jwt.verify(token, {}, (err, decoded) => {
            if (err) {
              return reject(err);
            } else {
              resolve(decoded);
            }
          });
        });

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
