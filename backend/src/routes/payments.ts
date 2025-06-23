import { Router } from 'express';
import {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  getRecentPayments,
} from '../controllers/paymentsController';
import {
  validate,
  validateQuery,
  createPaymentSchema,
  updatePaymentSchema,
  paginationSchema,
} from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - account_id
 *         - amount
 *         - date
 *         - description
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated payment ID
 *         account_id:
 *           type: integer
 *           description: Associated account ID
 *         amount:
 *           type: number
 *           description: Payment amount
 *         date:
 *           type: string
 *           format: date
 *           description: Payment date
 *         description:
 *           type: string
 *           description: Payment description
 *         type:
 *           type: string
 *           enum: [credit, debit]
 *           description: Payment type
 *         account_name:
 *           type: string
 *           description: Account name (when joined)
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments with pagination and filtering
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: account_id
 *         schema:
 *           type: integer
 *         description: Filter by account ID
 *     responses:
 *       200:
 *         description: List of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *                 pagination:
 *                   type: object
 */
router.get('/', authenticateToken, validateQuery(paginationSchema), getPayments);

/**
 * @swagger
 * /api/payments/recent:
 *   get:
 *     summary: Get recent payments
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of recent payments to return
 *     responses:
 *       200:
 *         description: List of recent payments
 */
router.get('/recent', authenticateToken, getRecentPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment details
 *       404:
 *         description: Payment not found
 */
router.get('/:id', authenticateToken, getPayment);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account_id
 *               - amount
 *               - date
 *               - description
 *             properties:
 *               account_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [credit, debit]
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', authenticateToken, validate(createPaymentSchema), createPayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Update payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [credit, debit]
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       404:
 *         description: Payment not found
 */
router.put('/:id', authenticateToken, validate(updatePaymentSchema), updatePayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Delete payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       404:
 *         description: Payment not found
 */
router.delete('/:id', authenticateToken, deletePayment);

export default router; 