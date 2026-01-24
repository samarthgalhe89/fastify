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

//register custom plugins
fastify.register(require("./plugins/mongodb"))
fastify.register(require("./plugins/jwt"))

//register routes
fastify.register(require("./routes/auth"), {prefix:  "api/auth"})

//Declare a route
fastify.get("/", (request, reply) => {
    reply.send({hello: "world"})
})

//test database connection
fastify.get("/test-db", async (request, reply) => {
    try {
        const mongoose = fastify.mongoose
        const connectionState = mongoose.connection.readyState

        let status = ""
        switch (connectionState) {
            case 0:
                status = "disconnected"
                break;
            case 1:
                status = "connected"
                break;
            case 2:
                status = "connecting"
                break;
            case 3:
                status = "disconnecting"
                break;
            default:
                status = "unknown"
                break;
        }

    } catch (error) {
        fastify.log.error(err);;
        reply.status(500).send({error: "Failed to test database connection"})
        process.exit(1)
    }
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
