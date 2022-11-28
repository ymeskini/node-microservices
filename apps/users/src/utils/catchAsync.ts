import { Handler, NextFunction, Request, Response } from 'express';

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): Handler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
