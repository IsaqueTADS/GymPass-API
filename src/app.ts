import fastify from "fastify";
import { env } from "./env/index.js";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

const envToLogger = {
  dev: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

export const app = fastify({
  logger: envToLogger[env.NODE_ENV] ?? true,
});

app.withTypeProvider<ZodTypeProvider>;

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/", function (request, reply) {
  request.log.info("Some info about the current request");
  reply.send({ hello: "world" });
});
