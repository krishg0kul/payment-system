import { Request, Response } from 'express';
import { PaymentModel } from '../models/Payment';
import { ApiError, asyncHandler } from '../middleware/errorHandler';

export const getPayments = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, account_id } = req.query as any;
  
  const result = await PaymentModel.findAll({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    search: search || undefined,
    account_id: account_id ? parseInt(account_id) : undefined,
  });

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const payment = await PaymentModel.findById(parseInt(id));
  
  if (!payment) {
    throw new ApiError('Payment not found', 404);
  }

  res.json({
    success: true,
    data: payment,
  });
});

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const payment = await PaymentModel.create(req.body);

  res.status(201).json({
    success: true,
    data: payment,
    message: 'Payment created successfully',
  });
});

export const updatePayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const payment = await PaymentModel.update(parseInt(id), req.body);
  
  if (!payment) {
    throw new ApiError('Payment not found', 404);
  }

  res.json({
    success: true,
    data: payment,
    message: 'Payment updated successfully',
  });
});

export const deletePayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const deleted = await PaymentModel.delete(parseInt(id));
  
  if (!deleted) {
    throw new ApiError('Payment not found', 404);
  }

  res.json({
    success: true,
    message: 'Payment deleted successfully',
  });
});

export const getRecentPayments = asyncHandler(async (req: Request, res: Response) => {
  const { limit } = req.query as any;
  
  const payments = await PaymentModel.getRecentPayments(parseInt(limit) || 10);

  res.json({
    success: true,
    data: payments,
  });
}); 