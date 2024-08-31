import dotenv from "dotenv";

dotenv.config({
  path: [".env", ".env.local"],
});

import fp from "fastify-plugin";

import * as schema from "@/schema.js";
import { createClient } from "@libsql/client";
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";

const client = createClient({
  url: process.env.TURSO_DB_URL!,
  authToken: process.env.TURSO_DB_TOKEN,
});

const db = drizzle(client, { schema });

export default fp(
  async (fastify) => {
    fastify.decorate("db", db);

    fastify.addHook("onClose", async () => {
      await client.close();
    });
  },
  { name: "drizzle-plugin" },
);

declare module "fastify" {
  export interface FastifyInstance {
    db: LibSQLDatabase<typeof schema>;
  }
}
