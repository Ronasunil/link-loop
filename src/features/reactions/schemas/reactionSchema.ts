import Joi from 'joi';

export const addReactionSchema = Joi.object({
  profilePic: Joi.string().allow(null, ''),
  userName: Joi.string().required().messages({
    'any.required': 'User name is missing',
  }),
  postId: Joi.string().required().messages({
    'any.required': 'postId is missing',
  }),
  authId: Joi.string().required().messages({
    'any.required': 'authId is missing',
  }),
  reactionType: Joi.string().required().valid('like', 'sad', 'laugh', 'wow', 'angry'),
});
