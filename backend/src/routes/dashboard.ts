import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary data
 *     tags: [Dashboard]
 *     description: Returns summary statistics including total accounts, balance, payments, and recent activity
 *     responses:
 *       200:
 *         description: Dashboard summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalAccounts:
 *                           type: integer
 *                         totalBalance:
 *                           type: number
 *                         totalPayments:
 *                           type: integer
 *                         totalCredits:
 *                           type: number
 *                         totalDebits:
 *                           type: number
 *                     recentPayments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Payment'
 *                     topAccounts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Account'
 *                     paymentTrends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                           count:
 *                             type: integer
 *                           amount:
 *                             type: number
 */
router.get('/summary', authenticateToken, getDashboardSummary);

export default router; 