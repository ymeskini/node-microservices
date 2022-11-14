import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import { AppError } from '../utils/AppError';
import { UserModel } from './users.model';

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
    const currentUser = await this.userModel
      .findOne({
        auth0Id: req.auth?.sub,
      })
      .select('-__v -auth0Id -createdAt');

    if (!currentUser) {
      return next(new AppError('Not Found', 404));
    }

    res.json(currentUser);
  };

  updateUser = async (req: Request, res: Response) => {
    const { body } = req;

    console.log(body);

    res.status(201).send();
  };

  createUser = async (req: Request, res: Response) => {
    const { body } = req;

    console.log(body);

    res.status(201).send();
  };

  deleteUser = async (req: Request, res: Response) => {
    const { body } = req;

    console.log(body);

    res.status(201).send();
  };
}
