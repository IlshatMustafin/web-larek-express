import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/products';
import { validateProductBody } from '../validators/product';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.post('/', validateProductBody, createProduct);

export default productRouter;