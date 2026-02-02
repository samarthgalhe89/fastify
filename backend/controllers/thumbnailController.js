const Thumbnail = require("../models/thumbnail.js")
const path = require("path")
const fs = require("fs")
const { pipeline } = require("stream")
const util = require("util")
const pipelineAsync = util.promisify(pipeline)

exports.createThumbnail = async (request, reply) => {
    try {
        const parts = request.parts()
        let fields = {}
        let filename;

        for await (const part of parts) {
            if (part.file) {
                filename = `${Date.now()}-${part.filename}`
                const saveTo = path.join(
                    __dirname,
                    "../uploads",
                    "thumbnails",
                    filename
                )
                await pipelineAsync(part.file, fs.createWriteStream(saveTo))
            } else {
                fields[part.fieldname] = part.value
            }
        }

        if (!filename) {
            return reply.code(400).send({
                success: false,
                message: "No image file provided"
            })
        }

        if (!fields.videoName) {
            return reply.code(400).send({
                success: false,
                message: "Video name is required"
            })
        }

        const thumbnail = new Thumbnail({
            user: request.user._id,
            videoName: fields.videoName,
            version: fields.version,
            image: `/uploads/thumbnails/${filename}`,
            paid: fields.paid === "true"
        })

        await thumbnail.save()
        reply.code(201).send({
            success: true,
            thumbnail
        })

    } catch (err) {
        request.log.error(err)
        reply.code(500).send({
            success: false,
            message: err.message || "Failed to create thumbnail",
            error: process.env.NODE_ENV === 'development' ? err.stack : undefined
        })
    }
}

exports.getThumbnails = async (request, reply) => {
    try {
        const thumbnails = await Thumbnail.find({ user: request.user._id })
        reply.send(thumbnails)
    } catch (err) {
        reply.send(err)
    }
}

exports.getThumbnail = async (request, reply) => {
    try {
        //validate first
        const thumbnail = await Thumbnail.findOne({
            _id: request.params.id,
            user: request.user._id
        })

        if (!thumbnail) {
            return reply.code(404).send({
                success: false,
                message: "Thumbnail not found"
            })
        }

        reply.send(thumbnail)

    } catch (err) {
        reply.code(500).send({
            success: false,
            message: err.message
        })
    }
}

exports.updateThumbnail = async (request, reply) => {
    try {
        const updatedData = request.body
        const thumbnail = await Thumbnail.findOneAndUpdate(
            {
                _id: request.params.id,
                user: request.user._id
            },
            updatedData,
            {
                new: true
            }
        )

        if (!thumbnail) {
            return reply.code(404).send({
                success: false,
                message: "Thumbnail not found"
            })
        }

        reply.send({ success: true, thumbnail })
    } catch (err) {
        reply.code(500).send({
            success: false,
            message: err.message
        })
    }
}

exports.deleteThumbnail = async (request, reply) => {
    try {
        const thumbnail = await Thumbnail.findOneAndDelete({
            _id: request.params.id,
            user: request.user._id
        })

        if (!thumbnail) {
            return reply.code(404).send({
                success: false,
                message: "Thumbnail not found"
            })
        }

        // Send success response first
        reply.send({ success: true, message: "Thumbnail deleted!" })

        // Try to delete file asynchronously (non-blocking)
        try {
            const filepath = path.join(
                __dirname,
                "../uploads",
                "thumbnails",
                path.basename(thumbnail.image)
            )

            // Use promises for better error handling
            const fsPromises = require('fs').promises
            await fsPromises.unlink(filepath)
        } catch (fileErr) {
            // Log file deletion errors but don't fail the request
            console.error('File deletion error:', fileErr.message)
        }

    } catch (err) {
        console.error('Delete error:', err)
        return reply.code(500).send({
            success: false,
            message: err.message
        })
    }
}

exports.deleteAllThumbnails = async (request, reply) => {
    try {
        const thumbnails = await Thumbnail.find({ user: request.user._id })

        await Thumbnail.deleteMany({ user: request.user._id })

        for (const thumbnail of thumbnails) {
            const filepath = path.join(
                __dirname,
                "../uploads",
                "thumbnails",
                path.basename(thumbnail.image)
            )

            fs.unlink(filepath, (err) => {
                if (err) console.error(err)
            })
        }

        reply.send({ success: true, message: "All thumbnails deleted!" })

    } catch (err) {
        reply.code(500).send({
            success: false,
            message: err.message
        })
    }
}   