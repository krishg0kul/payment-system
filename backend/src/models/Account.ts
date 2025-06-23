import { pool } from '../config/database';

export interface Account {
  id: number;
  name: string;
  balance: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateAccountData {
  name: string;
  balance?: number;
}

export interface UpdateAccountData {
  name?: string;
  balance?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
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

export class AccountModel {
  // Get all accounts with pagination and search
  static async findAll(params: PaginationParams): Promise<PaginatedResult<Account>> {
    const { page, limit, search } = params;
    const offset = (page - 1) * limit;
    
    let baseQuery = 'FROM accounts';
    let whereClause = '';
    let queryParams: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause = ` WHERE name ILIKE $${paramIndex}`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) ${baseQuery} ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT id, name, balance, created_at, updated_at 
      ${baseQuery} ${whereClause}
      ORDER BY created_at DESC 
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

  // Get account by ID
  static async findById(id: number): Promise<Account | null> {
    const result = await pool.query(
      'SELECT id, name, balance, created_at, updated_at FROM accounts WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // Create new account
  static async create(data: CreateAccountData): Promise<Account> {
    const { name, balance = 0 } = data;
    const result = await pool.query(
      `INSERT INTO accounts (name, balance) 
       VALUES ($1, $2) 
       RETURNING id, name, balance, created_at, updated_at`,
      [name, balance]
    );
    return result.rows[0];
  }

  // Update account
  static async update(id: number, data: UpdateAccountData): Promise<Account | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      values.push(data.name);
      paramIndex++;
    }

    if (data.balance !== undefined) {
      fields.push(`balance = $${paramIndex}`);
      values.push(data.balance);
      paramIndex++;
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE accounts 
      SET ${fields.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING id, name, balance, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete account
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM accounts WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Get account balance and transaction summary
  static async getAccountSummary(id: number) {
    const accountResult = await pool.query(
      'SELECT id, name, balance FROM accounts WHERE id = $1',
      [id]
    );

    if (accountResult.rows.length === 0) return null;

    const transactionSummary = await pool.query(`
      SELECT 
        COUNT(*) as total_transactions,
        COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) as total_credits,
        COALESCE(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0) as total_debits
      FROM payments 
      WHERE account_id = $1
    `, [id]);

    return {
      account: accountResult.rows[0],
      summary: transactionSummary.rows[0],
    };
  }
} 