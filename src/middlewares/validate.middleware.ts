import { Handler } from 'express';
import { Schema } from 'joi';
import { catchAsync } from '../utils/catchAsync';

export const validate = (schema: Schema): Handler =>
  catchAsync(async (req, _res, next) => {
    await schema.validateAsync(req, { stripUnknown: true });
    next();
  });
