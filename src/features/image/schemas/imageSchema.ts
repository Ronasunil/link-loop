import Joi from 'joi';

export const imageSchema = Joi.object({
  image: Joi.string().required().messages({
    'any.required': 'Image is required please provide one',
  }),
});
