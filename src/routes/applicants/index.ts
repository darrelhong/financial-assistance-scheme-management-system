import { applicant } from "../../schema.js";
import { FastifyPluginAsync } from "fastify";

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    "/",
    { preHandler: fastify.auth([fastify.verifyJWTandUser]) },
    async function (request, reply) {
      const applicants = await fastify.db.select().from(applicant);

      return applicants;
    }
  );
};

export default example;
