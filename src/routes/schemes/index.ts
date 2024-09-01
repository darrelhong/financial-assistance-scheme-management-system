import { scheme } from "../../schema.js";
import { FastifyPluginAsync } from "fastify";
import jsonLogic from "json-logic-js";

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    "/",
    { preHandler: fastify.auth([fastify.verifyJWTandUser]) },
    async function (request, reply) {
      const schemes = await fastify.db.select().from(scheme);

      return schemes;
    }
  );

  fastify.post<{ Body: { name: string; eligibilityLogic: object } }>(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "eligibilityLogic"],
          properties: {
            name: { type: "string" },
            eligibilityLogic: { type: "object" },
          },
        },
      },
      preHandler: fastify.auth([fastify.verifyJWTandUser]),
    },
    async function (request, reply) {
      const { name, eligibilityLogic } = request.body;

      // test if eligibilityCriteria is valid JsonLogic
      try {
        jsonLogic.apply(eligibilityLogic, {});
      } catch (e) {
        reply
          .status(400)
          .send({ error: "Eligibility criteria logic is not valid" });
      }

      const res = await fastify.db
        .insert(scheme)
        .values({
          name,
          eligibility: JSON.stringify(eligibilityLogic),
        })
        .returning();

      return res[0];
    }
  );
};

export default example;
