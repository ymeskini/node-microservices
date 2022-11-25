import Joi from 'joi';

const validRole = Joi.string().valid('customer', 'supplier', 'admin');

export const validMongoId = Joi.string().hex().length(24).required();

export const profileValidPayload = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  gender: Joi.string(),
  phone: Joi.string(),
  birthDate: Joi.string(),
  addresses: Joi.array().items(
    Joi.object({
      address: Joi.string(),
      city: Joi.string(),
      postalCode: Joi.string(),
      state: Joi.string(),
      primary: Joi.boolean(),
      label: Joi.string(),
    }),
  ),
});

export const adminUpdateUserPayload = profileValidPayload.keys({
  roles: Joi.array().items(validRole.required()).required(),
});

export const validCreateUserBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  roles: Joi.array().items(validRole.required()).required(),
});

export const validIdParamsMongoId = Joi.object({
  id: validMongoId.required(),
});
