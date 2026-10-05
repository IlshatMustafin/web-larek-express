import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      payment,
      email,
      phone,
      address,
      total,
      items,
    } = req.body;

    if (payment !== 'card' && payment !== 'online') {
      throw new BadRequestError('Неверный способ оплаты');
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new BadRequestError('Неверный email');
    }

    if (!phone || typeof phone !== 'string') {
      throw new BadRequestError('Неверный телефон');
    }

    if (!address || typeof address !== 'string') {
      throw new BadRequestError('Неверный адрес');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestError('items должен быть непустым массивом');
    }

    const products = await Product.find({ _id: { $in: items } });

    const notFound = items.filter((id) => !products.find((p) => p._id.toString() === id));
    if (notFound.length > 0) {
      throw new NotFoundError(`Товары не найдены: ${notFound.join(', ')}`);
    }

    const notForSale = products.filter((p) => p.price === null);
    if (notForSale.length > 0) {
      throw new BadRequestError('Некоторые товары не продаются');
    }

    const sum = products.reduce((acc, p) => acc + (p.price ?? 0), 0);
    if (sum !== total) {
      throw new BadRequestError('Неверная сумма заказа');
    }

    const id = faker.string.uuid();

    res.status(201).send({ id, total });
  } catch (err) {
    next(err);
  }
};
