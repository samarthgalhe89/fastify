require("dotenv").config();
const path = require("path");
const fastify = require("fastify")({logger: true})

//register plugins
fastify.register(require("@fastify/cors"))
fastify.register(require("@fastify/sensible"))
fastify.register(require("@fastify/env"), {
    dotenv: true,
    schema: {
        type: "object",
        required: ["PORT", "MONGO_URI", "JWT_SECRET"],
        properties: {
            PORT: {type: "string", default: 3000},
            MONGO_URI: {type: "string"},
            JWT_SECRET: {type: "string"}
        }
    }
})

//Declare a route
fastify.get("/", (request, reply) => {
    reply.send({hello: "world"})
})

const start = async () => {
    try {
        await fastify.listen({port: process.env.PORT})
        fastify.log.info(`Server running at http://localhost:${process.env.PORT}`)
    } catch (err){
        fastify.log.error(err)
        process.exit(1)
    }
}

start();
