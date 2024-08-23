import Joi from 'joi';

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().required().email().messages({
    'string.base': 'Email must be string',
    'string.empty': 'Please enter the email',
    'string.email': 'Invalid email address',
  }),
});
