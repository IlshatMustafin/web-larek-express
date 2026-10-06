import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
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
    const priceMap = new Map(products.map((p) => [p._id.toString(), p.price]));

    const notFound = items.filter((id) => !priceMap.has(id));
    if (notFound.length > 0) {
      throw new BadRequestError(`Товары не найдены: ${notFound.join(', ')}`);
    }

    const notForSale = items.filter((id) => priceMap.get(id) === null);
    if (notForSale.length > 0) {
      throw new BadRequestError('Некоторые товары не продаются');
    }

    const sum = items.reduce((acc, id) => acc + (priceMap.get(id) ?? 0), 0);
    if (sum !== total) {
      throw new BadRequestError('Неверная сумма заказа');
    }

    const id = faker.string.uuid();

    res.status(200).send({ id, total });
  } catch (err) {
    next(err);
  }
};

export default createOrder;
