const Joi = require("joi");

const PlaylistPayloadSchema = Joi.object({
    name: Joi.string().max(50).required(),
});

module.exports = { PlaylistPayloadSchema };
