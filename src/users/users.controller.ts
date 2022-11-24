import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';

import { blockUser, createAuth0User, getAuth0Token } from '../libs/auth0';
import { AppError } from '../utils/AppError';
import { UserModel } from './users.model';

const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 0;

export class UserController {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  listUsers = async (req: Request, res: Response) => {
    const { query } = req;
    const offset = Number(query['offset']) || DEFAULT_OFFSET;
    const limit = Number(query['limit']) || DEFAULT_LIMIT;

    const users = await this.userModel
      .find()
      .skip(offset)
      .limit(limit)
      .select('-__v');
    res.json({ users });
  };

  updateUser = async (req: Request, res: Response) => {
    const { body } = req;

    await this.userModel.findByIdAndUpdate(req.params['id'], body);

    res.json({
      id: req.params['id'],
    });
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    const userAlreadyExists = await this.userModel.findOne({
      email: body.email,
    });

    if (userAlreadyExists) {
      return next(new AppError('User Already exists', 409));
    }

    const { data: token } = await getAuth0Token();
    const { data } = await createAuth0User(body, token.access_token);

    res.json(data);
  };

  deleteUser = async (req: Request, res: Response) => {
    const userId = req.params['id'] as string;

    await this.userModel.findByIdAndUpdate(userId, { status: 'closed' });

    const { data: token } = await getAuth0Token();
    await blockUser(`auth0|${userId}`, token.access_token);
    res.sendStatus(204);
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.userModel.findById(req.params['id']);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json(user);
  };
}
