import { Router } from 'express';
import { createOrder } from '../controllers/orders';
import { validateOrderBody } from '../validators/order';

const orderRouter = Router();

orderRouter.post('/', validateOrderBody, createOrder);

export default orderRouter;