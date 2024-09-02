import { administrator } from "../../schema.js";
import { eq } from "drizzle-orm";
import { FastifyPluginAsync } from "fastify";

const admin: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: { username: string; password: string } }>(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
    async function (request, reply) {
      // hardcode for simplicity
      if (
        request.body.username === "admin" &&
        request.body.password === "password"
      ) {
        const res = await fastify.db
          .select()
          .from(administrator)
          .where(eq(administrator.id, 1));

        const { id, name } = res[0];

        fastify.jwt.sign({ id, name }, {}, (err, token) => {
          if (err) {
            return reply.send(err);
          }
          reply.setCookie("token", token);
          reply.send({ token });
        });
      }
    }
  );

  fastify.get(
    "/me",
    {
      preHandler: fastify.auth([fastify.verifyJWTandUser]),
    },
    async function (request, reply) {
      return request.admin;
    }
  );
};

export default admin;
