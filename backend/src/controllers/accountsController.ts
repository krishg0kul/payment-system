import { Request, Response } from 'express';
import { AccountModel } from '../models/Account';
import { ApiError, asyncHandler } from '../middleware/errorHandler';

export const getAccounts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search } = req.query as any;
  
  const result = await AccountModel.findAll({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    search: search || undefined,
  });

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getAccount = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const account = await AccountModel.findById(parseInt(id));
  
  if (!account) {
    throw new ApiError('Account not found', 404);
  }

  res.json({
    success: true,
    data: account,
  });
});

export const getAccountSummary = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const summary = await AccountModel.getAccountSummary(parseInt(id));
  
  if (!summary) {
    throw new ApiError('Account not found', 404);
  }

  res.json({
    success: true,
    data: summary,
  });
});

export const createAccount = asyncHandler(async (req: Request, res: Response) => {
  const account = await AccountModel.create(req.body);

  res.status(201).json({
    success: true,
    data: account,
    message: 'Account created successfully',
  });
});

export const updateAccount = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const account = await AccountModel.update(parseInt(id), req.body);
  
  if (!account) {
    throw new ApiError('Account not found', 404);
  }

  res.json({
    success: true,
    data: account,
    message: 'Account updated successfully',
  });
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const deleted = await AccountModel.delete(parseInt(id));
  
  if (!deleted) {
    throw new ApiError('Account not found', 404);
  }

  res.json({
    success: true,
    message: 'Account deleted successfully',
  });
}); 