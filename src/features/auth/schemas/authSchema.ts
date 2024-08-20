import Joi from 'joi';

export const authSchema = Joi.object({
  userName: Joi.string().required().min(4).max(20).messages({
    'string.base': 'Username must only include characters',
    'string.empty': 'Please fill this field',
    'string.min': 'Username must need 4 character',
    'string.max': 'Total character for username is 20',
  }),

  email: Joi.string().required().email().messages({
    'string.base': 'Email must be string',
    'string.empty': 'Please fill this field',
    'string.email': 'Invalid email address',
  }),

  password: Joi.string()
    .min(8)
    .required()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .messages({
      'string.base': 'Password must be string',
      'string.empty': 'Please fill this field',
      'string.pattern.base':
        ' Password must be 8-32 characters with at least one uppercase, lowercase, and special character',
    }),

  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.base': 'Confirm-password must be string',
    'any.only': 'Confirm-password  and password must be same',
  }),

  avatarColor: Joi.string(),
  avatarImage: Joi.string(),
});
