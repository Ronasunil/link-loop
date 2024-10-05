import Joi from 'joi';

export const passwordUpdationSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      'string.base': 'Password must be string',
      'string.empty': 'currentPassword is required',
      'string.base.pattern':
        'Password must be 8-32 characters with at least one uppercase, lowercase, and special character',
    }),

  newPassword: Joi.string()
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      'string.base': 'Password must be string',
      'string.empty': 'newPassword is required',
      'string.base.pattern':
        'Password must be 8-32 characters with at least one uppercase, lowercase, and special character',
    }),

  confirmPassword: Joi.string()
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .valid(Joi.ref('newPassword'))
    .messages({
      'string.base': 'Confirm-password must be string',
      'any.only': 'Confirm-password  and password must be same',
    }),
});
