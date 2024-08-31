import Joi, { required } from 'joi';

export const postSchema = Joi.object({
  content: Joi.string().required().allow(null, ''),
  bgColor: Joi.string().required().allow(null, ''),
  feelings: Joi.string().required().allow(null, ''),
  profilePic: Joi.string().required().allow(null, ''),
  privacy: Joi.string().required().valid('unlisted', 'public', 'private'),
  gifUrl: Joi.string().required().allow(null, ''),
});

export const postWithImageSchema = Joi.object({
  image: Joi.string().required(),
  bgColor: Joi.string().required().allow(null, ''),
  feelings: Joi.string().required().allow(null, ''),
  profilePic: Joi.string().required().allow(null, ''),
  privacy: Joi.string().required().valid('unlisted', 'public', 'private'),
  gifUrl: Joi.string().required().allow(null, ''),
});

export const postUpdationSchema = Joi.object({
  image: Joi.string().optional().allow(null, ''),
  bgColor: Joi.string().optional().allow(null, ''),
  feelings: Joi.string().optional().allow(null, ''),
  profilePic: Joi.string().optional().allow(null, ''),
  privacy: Joi.string().optional().valid('unlisted', 'public', 'private'),
  gifUrl: Joi.string().optional().allow(null, ''),
  content: Joi.string().optional().allow(null, ''),
  imageId: Joi.string().optional().allow(null, ''),
  imageVersion: Joi.string().optional().allow(null, ''),
  reactions: Joi.object({
    like: Joi.number().required().default(0),
    wow: Joi.number().required().default(0),
    sad: Joi.number().required().default(0),
    angry: Joi.number().required().default(0),
    laugh: Joi.number().required().default(0),
  }).optional(),
});