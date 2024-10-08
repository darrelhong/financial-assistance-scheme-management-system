import * as path from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import { fileURLToPath } from "url";
import fastifyCookiePlugin from "@fastify/cookie";
import fastifySwaggerPlugin from "@fastify/swagger";
import fastifySwaggerUiPlugin from "@fastify/swagger-ui";

import dotenv from "dotenv";

dotenv.config({
  path: [".env", ".env.local"],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
  fastify.register(fastifySwaggerPlugin, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "API Documentation",
        description: "API Documentation",
        version: "0.1.0",
      },
    },
  });

  fastify.register(fastifySwaggerUiPlugin, {
    routePrefix: "/documentation",
  });

  fastify.register(fastifyCookiePlugin);
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: opts,
    forceESM: true,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: opts,
    forceESM: true,
  });
};

export default app;
export { app, options };
