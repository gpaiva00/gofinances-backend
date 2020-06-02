import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new AppError('JWT is missing', 401);

  const [, token] = authHeader.split(' ');

  try {
    const { secret } = authConfig.jwt;
    const decoded = verify(token, secret);

    // força a tipagem de decoded para TokenPayload
    const { sub: userId } = decoded as TokenPayload;

    /** Guardar a informação do usuário para listar apenas agendamentos
     * do usuário logado
     * usando @types/express para forçar essa nova prop user
     * dentro da interface Request
     */
    req.user = {
      id: userId,
    };

    next();
  } catch {
    throw new AppError('Invalid JWT', 401);
  }
}
