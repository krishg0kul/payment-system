import { Request, Response } from 'express';
import { AccountModel } from '../models/Account';

export const getAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch accounts'
    });
  }
};

export const getAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const account = await AccountModel.findById(parseInt(id));
    
    if (!account) {
      res.status(404).json({
        success: false,
        error: 'Account not found'
      });
      return;
    }

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch account'
    });
  }
};

export const getAccountSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const summary = await AccountModel.getAccountSummary(parseInt(id));
    
    if (!summary) {
      res.status(404).json({
        success: false,
        error: 'Account not found'
      });
      return;
    }

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Get account summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch account summary'
    });
  }
};

export const createAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const account = await AccountModel.create(req.body);

    res.status(201).json({
      success: true,
      data: account,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create account'
    });
  }
};

export const updateAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const account = await AccountModel.update(parseInt(id), req.body);
    
    if (!account) {
      res.status(404).json({
        success: false,
        error: 'Account not found'
      });
      return;
    }

    res.json({
      success: true,
      data: account,
      message: 'Account updated successfully',
    });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update account'
    });
  }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const deleted = await AccountModel.delete(parseInt(id));
    
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Account not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account'
    });
  }
}; 