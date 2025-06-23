import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      res.status(400).json({
        error: 'Validation failed',
        details: errorDetails
      });
      return;
    }
    
    next();
  };
};

export const createAccountSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  balance: Joi.number().min(0).default(0)
});

export const updateAccountSchema = Joi.object({
  name: Joi.string().min(1).max(255),
  balance: Joi.number().min(0)
}).min(1);

export const createPaymentSchema = Joi.object({
  account_id: Joi.number().integer().positive().required(),
  amount: Joi.number().positive().required(),
  date: Joi.date().iso().required(),
  description: Joi.string().min(1).max(500).required(),
  type: Joi.string().valid('credit', 'debit').default('debit')
});

export const updatePaymentSchema = Joi.object({
  account_id: Joi.number().integer().positive(),
  amount: Joi.number().positive(),
  date: Joi.date().iso(),
  description: Joi.string().min(1).max(500),
  type: Joi.string().valid('credit', 'debit')
}).min(1);

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow('').optional(),
  account_id: Joi.number().integer().positive().optional()
});

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query);
    
    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      res.status(400).json({
        error: 'Query validation failed',
        details: errorDetails
      });
      return;
    }
    
    req.query = value;
    next();
  };
}; 