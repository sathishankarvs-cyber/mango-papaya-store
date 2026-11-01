import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  id: string;
  email: string;
  role: 'customer' | 'admin' | 'superadmin';
}

export const generateToken = (payload: JwtPayload, isAdmin = false): string => {
  const expiresIn = isAdmin ? config.jwt.adminExpiresIn : config.jwt.expiresIn;
  return jwt.sign(payload, config.jwt.secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};
