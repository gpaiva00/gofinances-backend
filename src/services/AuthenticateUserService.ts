import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../config/auth';

// import AppError from '../errors/AppError';

interface Request {
  email: string;
}

interface Response {
  user?: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { email } });

    // if (!user) throw new AppError('Incorrect email/password', 401);

    const { expiresIn, secret } = authConfig.jwt;

    const token = sign({}, secret, {
      // subject: sempre vai ser o userID para saber a quem pertence o token
      subject: user?.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
