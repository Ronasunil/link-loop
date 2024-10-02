import Joi from 'joi';

export const chatSchema = Joi.object({
  conversationId: Joi.string().optional().default('').allow(''),
  reciverId: Joi.string().required().messages({ 'any.required': 'reciverId is required' }),
  reciverProfileImg: Joi.string().required().allow('').messages({ 'any.required': 'reciverProfileImg is required' }),
  reciverName: Joi.string().required().messages({ 'any.required': 'reciverName is required' }),
  message: Joi.string().optional().default('').allow(''),
  image: Joi.string().optional().default('').allow(''),
  gif: Joi.string().optional().default('').allow(''),
});

export const chatReactionSchema = Joi.object({
  type: Joi.string().required().valid('like', 'love', 'sad', 'laugh', 'angry').messages({
    'any.required': 'The type field is required.',
    'string.base': 'The type must be a string.',
    'any.only': 'The type must be one of the following: like, love, sad, laugh, angry.',
  }),
});

export const chatDeletionSchema = Joi.object({
  type: Joi.string().required().allow('deleteForMe', 'deleteForEveryone'),
});

export const userChatSchema = Joi.object({
  userOne: Joi.string().required().messages({ 'any.required': 'userOne is required' }),
  userTwo: Joi.string().required().messages({ 'any.required': 'userTwo is required' }),
});
