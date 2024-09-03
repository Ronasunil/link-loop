import Joi from 'joi';

export const commentSchema = Joi.object({
  userTo: Joi.string().required().messages({
    'any.required': 'userTo is rquired',
  }),
  profilePic: Joi.string().required().default('').allow(null, '').messages({
    'any.required': 'profilePic is required',
  }),

  postId: Joi.string().required().messages({
    'any.required': 'postId is required',
  }),
  comment: Joi.string().required().messages({
    'any.required': 'This field is required',
  }),
});

export const commentUpdationSchema = Joi.object({
  comment: Joi.string().required().messages({
    'any.required': 'This field is required',
  }),
});
