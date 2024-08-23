import Joi from 'joi';

export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      'string.base': 'Password should be string',
      'string.empty': 'Please enter the password',
      'string.pattern.base': 'Password must be 8-32 characters with at least one uppercase, lowercase, and special character',
    }),

  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.base': 'confirm-password should be string',
    'string.empty': 'Please enter the confirm-password',
    'any.only': 'Confirm-password must be same as password',
  }),
});
