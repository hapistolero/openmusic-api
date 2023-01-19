const Joi = require("joi");

const currentYear = new Date().getFullYear();

const SongPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().max(currentYear).required(),
    genre: Joi.string().max(50).required(),
    performer: Joi.string().max(50).required(),
    duration: Joi.number(),
    albumId: Joi.string().max(50),

});

module.exports = { SongPayloadSchema };
