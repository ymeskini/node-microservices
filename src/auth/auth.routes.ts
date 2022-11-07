import { Router } from 'express';
import { User } from '../users/users.model';
import { AuthController } from './auth.controller';

const authController = new AuthController(User);
export const authRouter = Router();

authRouter.get('/callback', authController.authCallback);
