import { Request, Response } from 'express';
import { PaymentModel } from '../models/Payment';

export const getPayments = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payments'
    });
  }
};

export const getPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const payment = await PaymentModel.findById(parseInt(id));
    
    if (!payment) {
      res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
      return;
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment'
    });
  }
};

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = await PaymentModel.create(req.body);

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment created successfully',
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment'
    });
  }
};

export const updatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const payment = await PaymentModel.update(parseInt(id), req.body);
    
    if (!payment) {
      res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
      return;
    }

    res.json({
      success: true,
      data: payment,
      message: 'Payment updated successfully',
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payment'
    });
  }
};

export const deletePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const deleted = await PaymentModel.delete(parseInt(id));
    
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Payment deleted successfully',
    });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete payment'
    });
  }
};

export const getRecentPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit } = req.query as any;
    
    const payments = await PaymentModel.getRecentPayments(parseInt(limit) || 10);

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error('Get recent payments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent payments'
    });
  }
}; 