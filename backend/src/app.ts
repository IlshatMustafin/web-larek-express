import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import NotFoundError from './errors/not-found-error';
import errorHandler from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;
mongoose.connect(DB_ADDRESS);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

app.use('/product', productsRouter);
app.use('/order', ordersRouter);

app.use(errors());

app.use((_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
