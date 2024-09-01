import { FastifyPluginAsync } from "fastify";
import { application, applicant, scheme } from "../../schema.js";
import { eq } from "drizzle-orm";
import jsonLogic from "json-logic-js";

const applications: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get(
    "/",
    { preHandler: fastify.auth([fastify.verifyJWTandUser]) },
    async function (request, reply) {
      const applications = await fastify.db.select().from(application);

      return applications;
    }
  );

  fastify.post<{ Body: { applicant_id: number; scheme_id: number } }>(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["applicant_id", "scheme_id"],
          properties: {
            applicant_id: { type: "number" },
            scheme_id: { type: "number" },
          },
        },
      },
      preHandler: fastify.auth([fastify.verifyJWTandUser]),
    },
    async function (request, reply) {
      const { applicant_id, scheme_id } = request.body;

      const schemesRes = await fastify.db
        .select()
        .from(scheme)
        .where(eq(scheme.id, scheme_id));

      if (schemesRes.length === 0) {
        return reply.status(400).send({ error: "Scheme not found" });
      }

      const schemeData = schemesRes[0];

      const applicantRes = await fastify.db
        .select()
        .from(applicant)
        .where(eq(applicant.id, applicant_id));

      if (applicantRes.length === 0) {
        return reply.status(400).send({ error: "Applicant not found" });
      }

      const applicantData = applicantRes[0];

      try {
        const applicantFields = JSON.parse(applicantData.fields);
        const eligibilityLogic = JSON.parse(schemeData.eligibility);

        const isEligible = jsonLogic.apply(eligibilityLogic, applicantFields);

        if (!isEligible) {
          return reply
            .status(400)
            .send({ error: "Applicant is not eligible for the scheme" });
        }
      } catch (e) {
        return reply.status(500).send({ error: "Something went wrong" });
      }

      const res = await fastify.db
        .insert(application)
        .values({
          applicant_id: applicantData.id,
          scheme_id: schemeData.id,
          status: "pending",
        })
        .returning();

      return res[0];
    }
  );
};

export default applications;
