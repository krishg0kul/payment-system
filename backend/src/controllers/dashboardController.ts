import { Request, Response } from 'express';
import { PaymentModel } from '../models/Payment';
import { pool } from '../config/database';

export const getDashboardSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get total accounts count
    const accountsResult = await pool.query('SELECT COUNT(*) as total FROM accounts');
    const totalAccounts = parseInt(accountsResult.rows[0].total);

    // Get total balance across all accounts
    const balanceResult = await pool.query('SELECT COALESCE(SUM(balance), 0) as total_balance FROM accounts');
    const totalBalance = parseFloat(balanceResult.rows[0].total_balance);

    // Get total payments count
    const paymentsResult = await pool.query('SELECT COUNT(*) as total FROM payments');
    const totalPayments = parseInt(paymentsResult.rows[0].total);

    // Get total credits and debits
    const transactionSummary = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) as total_credits,
        COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) as total_debits
      FROM payments
    `);

    const { total_credits, total_debits } = transactionSummary.rows[0];

    // Get recent payments
    const recentPayments = await PaymentModel.getRecentPayments(5);

    // Get top accounts by balance
    const topAccountsResult = await pool.query(`
      SELECT id, name, balance 
      FROM accounts 
      ORDER BY balance DESC 
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        summary: {
          totalAccounts,
          totalBalance: parseFloat(totalBalance.toFixed(2)),
          totalPayments,
          totalCredits: parseFloat(total_credits),
          totalDebits: parseFloat(total_debits),
        },
        recentPayments,
        topAccounts: topAccountsResult.rows
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
}; 