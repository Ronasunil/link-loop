import Joi from 'joi';

export const socialMediaSchema = Joi.object({
  facebook: Joi.string().optional().default('').allow('', null),
  instagram: Joi.string().optional().default('').allow('', null),
});

export const basicInfoSchema = Joi.object({
  quote: Joi.string().optional().allow('', null),
  string: Joi.string().optional().allow('', null),
  school: Joi.string().optional().allow('', null),
  job: Joi.string().optional().allow('', null),
  location: Joi.string().optional().allow('', null),
});

export const notificationSchema = Joi.object({
  onFollow: Joi.boolean().optional().allow(null),
  onMessage: Joi.boolean().optional().allow(null),
  onLike: Joi.boolean().optional().allow(null),
  onComment: Joi.boolean().optional().allow(null),
});
