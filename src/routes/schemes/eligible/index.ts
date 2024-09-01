import { FastifyPluginAsync } from "fastify";
import { applicant, scheme } from "../../../schema.js";
import { eq } from "drizzle-orm";
import jsonLogic from "json-logic-js";

const eligibleSchemes: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get<{ Querystring: { applicant: number } }>(
    "/",
    {
      preHandler: fastify.auth([fastify.verifyJWTandUser]),
      schema: {
        querystring: {
          type: "object",
          properties: { applicant: { type: "number" } },
          required: ["applicant"],
        },
      },
    },
    async function (request, reply) {
      const { applicant: applicantId } = request.query;

      // to add pagination or some other logic in the future
      const schemes = await fastify.db.select().from(scheme).limit(100);

      const applicantRes = await fastify.db
        .select()
        .from(applicant)
        .where(eq(applicant.id, applicantId));

      if (applicantRes.length === 0) {
        return reply.status(404).send({ error: "Applicant not found" });
      }

      const applicantData = applicantRes[0];
      const applicantFields = JSON.parse(applicantData.fields);

      const eligbleSchemes: Pick<typeof scheme.$inferSelect, "id" | "name">[] =
        [];

      for (const schemeToCheck of schemes) {
        try {
          const eligibilityLogic = JSON.parse(schemeToCheck.eligibility);

          const isEligible = jsonLogic.apply(eligibilityLogic, applicantFields);

          if (isEligible) {
            eligbleSchemes.push({
              id: schemeToCheck.id,
              name: schemeToCheck.name,
            });
          }
        } catch (e) {
          request.log.error(e);
        }
      }

      return { eligbleSchemes };
    }
  );
};

export default eligibleSchemes;
