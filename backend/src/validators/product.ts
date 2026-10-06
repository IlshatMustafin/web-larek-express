import { Joi, celebrate, Segments } from 'celebrate';

const validateProductBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
    category: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().optional().allow(null),
  }),
});

export default validateProductBody;
