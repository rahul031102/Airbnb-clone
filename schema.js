const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .required()
      .messages({
        "string.empty": "Title is required",
      }),

    description: Joi.string()
      .required()
      .messages({
        "string.empty": "Description is required",
      }),

    image: Joi.string()
      .uri()
      .empty("")
      .default("/images/building.jpg"),

    price: Joi.number()
      .min(0)
      .required()
      .messages({
        "number.min": "Price must be positive",
      }),

    location: Joi.object({
      city: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),

    host: Joi.string().optional(),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required().min(3)
  }).required()
});

module.exports = { listingSchema, reviewSchema };