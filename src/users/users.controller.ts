import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import Joi from 'joi';
import { createAuth0User, getAuth0Token } from '../libs/auth0';

import { AppError } from '../utils/AppError';
import { UserModel } from './users.model';

const profileValidPayload = Joi.object({
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
}).required();

const validCreateUserBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export class UserController {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  listUsers = async (_req: Request, res: Response) => {
    const users = await this.userModel.find().select('-__v');
    res.json({ users });
  };

  profile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.auth?.sub?.split('|')[1];
    const currentUser = await this.userModel
      .findById(userId)
      .select('-__v -auth0Id -createdAt -tenant -connection -password');

    if (!currentUser) {
      return next(new AppError('Not Found', 404));
    }

    res.json(currentUser);
  };

  updateProfile = async (req: Request, res: Response) => {
    await profileValidPayload.validateAsync(req.body);

    const userId = req.auth?.sub?.split('|')[1];
    await this.userModel.findByIdAndUpdate(userId, req.body);

    res.status(201).send();
  };

  closeProfile = async (req: Request, res: Response) => {
    const userId = req.auth?.sub?.split('|')[1];
    await this.userModel.findByIdAndUpdate(userId, { status: 'closed' });

    res.status(201).send();
  };

  updateUser = async (req: Request, res: Response) => {
    const { body } = req;

    await profileValidPayload.validateAsync(body);
    await this.userModel.findByIdAndUpdate(req.params['id'], body);

    res.status(201).send();
  };

  createUser = async (req: Request, res: Response) => {
    const { body } = req;

    await validCreateUserBody.validateAsync(body);
    const { data: token } = await getAuth0Token();
    const { data } = await createAuth0User(body, token.access_token);

    res.status(200).send(data);
  };

  deleteUser = async (req: Request, res: Response) => {
    await this.userModel.findByIdAndUpdate(req.params['id'], {
      status: 'closed',
    });

    res.status(201).send();
  };
}
