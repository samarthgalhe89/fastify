const fastify = require("fastify")({logger: true})

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

start()
