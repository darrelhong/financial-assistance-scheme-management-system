import { applicant } from "../../schema.js";
import { FastifyPluginAsync } from "fastify";
import { applicantFieldsSchema } from "./applicant-fields-schema.js";

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    "/",
    { preHandler: fastify.auth([fastify.verifyJWTandUser]) },
    async function (request, reply) {
      const applicants = await fastify.db.select().from(applicant);

      return applicants;
    }
  );

  fastify.post<{ Body: { name: string; fields: object } }>(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "fields"],
          properties: {
            name: { type: "string" },
            fields: { type: "object" },
          },
        },
      },
      preHandler: fastify.auth([fastify.verifyJWTandUser]),
    },
    async function (request, reply) {
      const { name, fields } = request.body;

      const { data: applicantFields, error } =
        applicantFieldsSchema.safeParse(fields);
      if (error) {
        return reply.status(400).send({ issues: error.issues });
      }

      const res = await fastify.db
        .insert(applicant)
        .values({
          name,
          fields: JSON.stringify(applicantFields),
        })
        .returning();

      const row = res[0];

      return { id: row.id, name: row.name, fields: row.fields };
    }
  );
};

export default example;
