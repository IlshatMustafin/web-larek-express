import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

interface IErrorWithStatusCode extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: IErrorWithStatusCode,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof MongooseError.ValidationError) {
    return res.status(400).send({ message: 'Некорректные данные при создании товара' });
  }

  if (err instanceof Error && err.message.includes('E11000')) {
    return res.status(409).send({ message: 'Товар с таким названием уже существует' });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  return res.status(statusCode).send({ message });
};

export default errorHandler;
