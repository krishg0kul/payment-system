import { pool } from '../config/database';

export interface Payment {
  id: number;
  account_id: number;
  amount: number;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  created_at?: Date;
  updated_at?: Date;
  account_name?: string; // For joined queries
}

export interface CreatePaymentData {
  account_id: number;
  amount: number;
  date: string;
  description: string;
  type?: 'credit' | 'debit';
}

export interface UpdatePaymentData {
  account_id?: number;
  amount?: number;
  date?: string;
  description?: string;
  type?: 'credit' | 'debit';
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  account_id?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class PaymentModel {
  // Get all payments with pagination, search, and optional account filter
  static async findAll(params: PaginationParams): Promise<PaginatedResult<Payment>> {
    const { page, limit, search, account_id } = params;
    const offset = (page - 1) * limit;
    
    let baseQuery = `
      FROM payments p 
      LEFT JOIN accounts a ON p.account_id = a.id
    `;
    
    const whereConditions = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`(p.description ILIKE $${paramIndex} OR a.name ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (account_id) {
      whereConditions.push(`p.account_id = $${paramIndex}`);
      queryParams.push(account_id);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? ` WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) ${baseQuery} ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT 
        p.id, p.account_id, p.amount, p.date, p.description, p.type,
        p.created_at, p.updated_at, a.name as account_name
      ${baseQuery} ${whereClause}
      ORDER BY p.created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);
    
    const dataResult = await pool.query(dataQuery, queryParams);

    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get payment by ID
  static async findById(id: number): Promise<Payment | null> {
    const result = await pool.query(`
      SELECT 
        p.id, p.account_id, p.amount, p.date, p.description, p.type,
        p.created_at, p.updated_at, a.name as account_name
      FROM payments p
      LEFT JOIN accounts a ON p.account_id = a.id
      WHERE p.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  // Create new payment
  static async create(data: CreatePaymentData): Promise<Payment> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const { account_id, amount, date, description, type = 'debit' } = data;
      
      // Insert payment
      const paymentResult = await client.query(`
        INSERT INTO payments (account_id, amount, date, description, type) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, account_id, amount, date, description, type, created_at, updated_at
      `, [account_id, amount, date, description, type]);

      // Update account balance
      const balanceChange = type === 'credit' ? amount : -amount;
      await client.query(
        'UPDATE accounts SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [balanceChange, account_id]
      );

      await client.query('COMMIT');
      
      // Get account name for response
      const accountResult = await client.query('SELECT name FROM accounts WHERE id = $1', [account_id]);
      const payment = paymentResult.rows[0];
      payment.account_name = accountResult.rows[0]?.name;

      return payment;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Update payment
  static async update(id: number, data: UpdatePaymentData): Promise<Payment | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get original payment for balance adjustment
      const originalResult = await client.query('SELECT * FROM payments WHERE id = $1', [id]);
      if (originalResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }
      
      const original = originalResult.rows[0];

      const fields = [];
      const values = [];
      let paramIndex = 1;

      if (data.account_id !== undefined) {
        fields.push(`account_id = $${paramIndex}`);
        values.push(data.account_id);
        paramIndex++;
      }

      if (data.amount !== undefined) {
        fields.push(`amount = $${paramIndex}`);
        values.push(data.amount);
        paramIndex++;
      }

      if (data.date !== undefined) {
        fields.push(`date = $${paramIndex}`);
        values.push(data.date);
        paramIndex++;
      }

      if (data.description !== undefined) {
        fields.push(`description = $${paramIndex}`);
        values.push(data.description);
        paramIndex++;
      }

      if (data.type !== undefined) {
        fields.push(`type = $${paramIndex}`);
        values.push(data.type);
        paramIndex++;
      }

      if (fields.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = `
        UPDATE payments 
        SET ${fields.join(', ')} 
        WHERE id = $${paramIndex}
        RETURNING id, account_id, amount, date, description, type, created_at, updated_at
      `;

      const paymentResult = await client.query(query, values);
      const updatedPayment = paymentResult.rows[0];

      // Reverse original balance change
      const originalBalanceChange = original.type === 'credit' ? -original.amount : original.amount;
      await client.query(
        'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
        [originalBalanceChange, original.account_id]
      );

      // Apply new balance change
      const newBalanceChange = updatedPayment.type === 'credit' ? updatedPayment.amount : -updatedPayment.amount;
      await client.query(
        'UPDATE accounts SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newBalanceChange, updatedPayment.account_id]
      );

      await client.query('COMMIT');

      // Get account name for response
      const accountResult = await client.query('SELECT name FROM accounts WHERE id = $1', [updatedPayment.account_id]);
      updatedPayment.account_name = accountResult.rows[0]?.name;

      return updatedPayment;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Delete payment
  static async delete(id: number): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get payment details for balance adjustment
      const paymentResult = await client.query('SELECT * FROM payments WHERE id = $1', [id]);
      if (paymentResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return false;
      }

      const payment = paymentResult.rows[0];

      // Delete payment
      const deleteResult = await client.query('DELETE FROM payments WHERE id = $1', [id]);
      
      if (deleteResult.rowCount && deleteResult.rowCount > 0) {
        // Reverse balance change
        const balanceChange = payment.type === 'credit' ? -payment.amount : payment.amount;
        await client.query(
          'UPDATE accounts SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [balanceChange, payment.account_id]
        );

        await client.query('COMMIT');
        return true;
      } else {
        await client.query('ROLLBACK');
        return false;
      }
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get recent payments for dashboard
  static async getRecentPayments(limit: number = 10): Promise<Payment[]> {
    const result = await pool.query(`
      SELECT 
        p.id, p.account_id, p.amount, p.date, p.description, p.type,
        p.created_at, a.name as account_name
      FROM payments p
      LEFT JOIN accounts a ON p.account_id = a.id
      ORDER BY p.created_at DESC
      LIMIT $1
    `, [limit]);
    
    return result.rows;
  }
} 