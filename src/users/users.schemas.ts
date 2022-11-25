import Joi from 'joi';

const validRole = Joi.string().valid('customer', 'supplier', 'admin');

export const validCreateUserBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const validAdminCreateUserBody = validCreateUserBody.keys({
  roles: Joi.array().items(validRole.required()).required(),
});

export const validPutUserBody = Joi.object({
  userMetadata: Joi.object({
    genre: Joi.string(),
    birth_date: Joi.string(),
    addresses: Joi.object({
      address: Joi.string().required(),
      city: Joi.string().required(),
      postal_code: Joi.string().required(),
      state: Joi.string().required(),
      primary: Joi.boolean().default(false),
      label: Joi.string().required(),
    }),
  }),
  user: Joi.object({
    email: Joi.string().email(),
    password: Joi.string()
      .min(8)
      .regex(/[A-Z]/, 'upper-case')
      .regex(/[a-z]/, 'lower-case')
      .regex(/[0-9]/, 'number character')
      .regex(/[^\w]/, 'special character'),
    phone_number: Joi.string(),
    family_name: Joi.string(),
    given_name: Joi.string(),
    picture: Joi.string(),
    username: Joi.string(),
  }),
});

export const validAdminPutUserBody = validPutUserBody.keys({
  roles: Joi.array().items(validRole.required()).required(),
});
