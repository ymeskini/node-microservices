import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import { AppError } from '../utils/AppError';

// import { AppError } from '../utils/AppError';
import { UserService } from './users.service';

const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 0;

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.userService.getUser(req.params['id'] as string);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

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
    console.log(req.isAdmin);
    // const user = await this.userService.createUser(body);

    res.json(body);
  };

  // updateUser = async (req: Request, res: Response) => {
  //   const { body } = req;

  //   await this.userModel.findByIdAndUpdate(req.params['id'], body);

  //   res.json({
  //     id: req.params['id'],
  //   });
  // };

  //   const { data: token } = await getAuth0Token();
  //   const { data } = await createAuth0User(body, token.access_token);

  //   res.json(data);
  // };

  // deleteUser = async (req: Request, res: Response) => {
  //   const userId = req.params['id'] as string;

  //   await this.userModel.findByIdAndUpdate(userId, { status: 'closed' });

  //   const { data: token } = await getAuth0Token();
  //   await blockUser(`auth0|${userId}`, token.access_token);
  //   res.sendStatus(204);
  // };
}
