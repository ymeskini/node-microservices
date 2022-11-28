import Joi from 'joi';

const validRole = Joi.string().valid('customer', 'supplier', 'admin');
const validPassword = Joi.string()
  .min(8)
  .regex(/[A-Z]/, 'upper-case')
  .regex(/[a-z]/, 'lower-case')
  .regex(/[0-9]/, 'number character')
  .regex(/[^\w]/, 'special character');

const validPhoneNumber = Joi.string().regex(/^\+(?:[0-9] ?){6,14}[0-9]$/);

export const validCreateUserBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const validAdminCreateUserBody = validCreateUserBody.keys({
  roles: Joi.array().items(validRole.required()).required(),
});

export const validPutUserBody = Joi.object({
  userMetadata: Joi.object({
    genre: Joi.string().required(),
    phone_number: validPhoneNumber.required(),
    birth_date: Joi.string().required(),
    username: Joi.string().required(),
    addresses: Joi.array()
      .required()
      .items({
        address: Joi.string().required(),
        city: Joi.string().required(),
        postal_code: Joi.string().required(),
        state: Joi.string().required(),
        primary: Joi.boolean().default(false),
        label: Joi.string().required(),
      }),
  }).required(),
  user: Joi.object({
    family_name: Joi.string().required(),
    given_name: Joi.string().required(),
    picture: Joi.string().required(),
    email: Joi.string().email(),
    password: validPassword,
  }).required(),
}).required();

export const validAdminPutUserBody = validPutUserBody
  .keys({
    roles: Joi.array().items(validRole.required()).required(),
  })
  .required();

export const validPatchUserBody = Joi.object({
  userMetadata: Joi.object({
    genre: Joi.string(),
    phone_number: validPhoneNumber,
    birth_date: Joi.string(),
    username: Joi.string(),
    addresses: Joi.array().items({
      address: Joi.string().required(),
      city: Joi.string().required(),
      postal_code: Joi.string().required(),
      state: Joi.string().required(),
      primary: Joi.boolean().default(false),
      label: Joi.string().required(),
    }),
  }).min(1),
  user: Joi.object({
    family_name: Joi.string(),
    given_name: Joi.string(),
    picture: Joi.string(),
    password: validPassword,
    email: Joi.string().email(),
  }).min(1),
}).min(1);

export const validAdminPatchUserBody = validPatchUserBody.keys({
  roles: Joi.array().items(validRole.required()),
});
