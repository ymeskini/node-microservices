import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import { AppError } from '../utils/AppError';

import { UserService } from './users.service';

const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 0;

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params['id'] as string;
    if (!req.isAdmin && req.auth?.sub !== userId) {
      return next(new AppError('Forbidden', 403));
    }
    const user = await this.userService.getUser(userId);

    res.json(user);
  };

  listUsers = async (req: Request, res: Response) => {
    const { query } = req;
    const offset = Number(query['offset']) || DEFAULT_OFFSET;
    const limit = Number(query['limit']) || DEFAULT_LIMIT;

    const users = await this.userService.getUsers(limit, offset);

    res.json({ users });
  };

  createUser = async (req: Request, res: Response) => {
    const { body } = req;
    const { roles, ...userData } = body;

    const user = await this.userService.createUser(userData, roles);

    res.json(user);
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params['id'] as string;

    if (!req.isAdmin && userId !== req.auth?.sub) {
      return next(new AppError('Forbidden', 403));
    }

    await this.userService.deleteUser(userId);

    res.sendStatus(204);
  };

  putUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params['id'] as string;

    if (!req.isAdmin && userId !== req.auth?.sub) {
      return next(new AppError('Forbidden', 403));
    }

    const user = await this.userService.putUser(
      userId,
      req.body.user,
      req.body.userMetadata,
      req.body.roles,
    );

    res.json(user);
  };

  patchUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params['id'] as string;

    if (!req.isAdmin && userId !== req.auth?.sub) {
      return next(new AppError('Forbidden', 403));
    }

    const user = await this.userService.putUser(
      userId,
      req.body.user,
      req.body.userMetadata,
      req.body.roles,
    );

    res.json(user);
  };
}
