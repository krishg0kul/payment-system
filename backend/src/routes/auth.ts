import express from 'express';
import { generateDemoToken } from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * /api/auth/demo-token:
 *   post:
 *     summary: Generate a demo JWT token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Demo token generated successfully
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
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                     expiresIn:
 *                       type: string
 *                       description: Token expiration duration (e.g., '24h')
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       description: Exact timestamp when token expires (ISO string)
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/demo-token', generateDemoToken);

export default router; 