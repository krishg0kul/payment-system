import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const generateDemoToken = (req: Request, res: Response): void => {
  try {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '8h';
    
    if (!secret) {
      res.status(500).json({ error: 'JWT secret not configured' });
      return;
    }

    const payload = {
      id: 1,
      username: 'demo',
      email: 'demo@example.com',
      iat: Math.floor(Date.now() / 1000)
    };

    const parseExpiration = (expiresIn: string): number => {
      if (expiresIn.endsWith('h')) {
        return parseInt(expiresIn) * 60 * 60;
      } else if (expiresIn.endsWith('d')) {
        return parseInt(expiresIn) * 24 * 60 * 60;
      } else if (expiresIn.endsWith('m')) {
        return parseInt(expiresIn) * 60;
      }
      return 8 * 60 * 60;
    };

    const expirationTime = Math.floor(Date.now() / 1000) + parseExpiration(expiresIn);
    const tokenPayload = {
      ...payload,
      exp: expirationTime
    };

    const token = jwt.sign(tokenPayload, secret);
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: payload.id,
          username: payload.username,
          email: payload.email
        },
        expiresIn,
        expiresAt: new Date(expirationTime * 1000).toISOString()
      },
      message: 'Demo token generated successfully'
    });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
}; 