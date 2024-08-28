import Joi from 'joi';

export const postSchema = Joi.object({
  content: Joi.string().required().allow(null, ''),
  bgColor: Joi.string().required().allow(null, ''),
  feelings: Joi.string().required().allow(null, ''),
  profilePic: Joi.string().required().allow(null, ''),
  privacy: Joi.string().required().allow('unlisted', 'public', 'private'),
  gifUrl: Joi.string().required().allow(null, ''),
});

export const postWithImageSchema = Joi.object({
  image: Joi.string().required(),
  bgColor: Joi.string().required().allow(null, ''),
  feelings: Joi.string().required().allow(null, ''),
  profilePic: Joi.string().required().allow(null, ''),
  privacy: Joi.string().required().allow('unlisted', 'public', 'private'),
  gifUrl: Joi.string().required().allow(null, ''),
});

export const postUpdationSchema = Joi.object({
  image: Joi.string().required().allow(null, ''),
  bgColor: Joi.string().required().allow(null, ''),
  feelings: Joi.string().required().allow(null, ''),
  profilePic: Joi.string().required().allow(null, ''),
  privacy: Joi.string().required().allow('unlisted', 'public', 'private'),
  gifUrl: Joi.string().required().allow(null, ''),
  content: Joi.string().required().allow(null, ''),
  imageId: Joi.string().required().allow(null, ''),
  imageVersion: Joi.string().required().allow(null, ''),
});
