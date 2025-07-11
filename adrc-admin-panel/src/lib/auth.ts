import jwt from 'jsonwebtoken';
import { AuthUser } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'adrc-secret-key';

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions,
    };
  } catch (error) {
    return null;
  }
}

export function hasPermission(user: AuthUser, permission: string): boolean {
  return user.permissions.includes(permission) || user.role === 'admin';
}