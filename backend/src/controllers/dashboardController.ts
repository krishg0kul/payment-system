import { Request, Response } from 'express';
import { PaymentModel } from '../models/Payment';
import { pool } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';

export const getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
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

  // Get payment trends (last 30 days)
  const trendsResult = await pool.query(`
    SELECT 
      DATE_TRUNC('day', created_at) as date,
      COUNT(*) as count,
      COALESCE(SUM(amount), 0) as total_amount
    FROM payments 
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date DESC
    LIMIT 7
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
      topAccounts: topAccountsResult.rows,
      paymentTrends: trendsResult.rows.map(row => ({
        date: row.date,
        count: parseInt(row.count),
        amount: parseFloat(row.total_amount),
      })),
    },
  });
}); 