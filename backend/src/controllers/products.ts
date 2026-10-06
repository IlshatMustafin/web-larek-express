import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => Product.find({})
  .then((items) => {
    res.send({ items, total: items.length });
  })
  .catch(next);

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    title, image, category, description, price,
  } = req.body;

  if (!title || !image || !category) {
    return next(new BadRequestError('Некорректные данные для создания товара'));
  }

  return Product.create({
    title, image, category, description, price,
  })
    .then((item) => res.status(201).send({ data: item }))
    .catch(next);
};
