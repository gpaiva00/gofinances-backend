import { getRepository } from 'typeorm';
import User from '../models/User';

import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  avatar: string;
}

class CreateUserService {
  public async execute({ name, email, avatar }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) throw new AppError('Email address already exists');

    const user = usersRepository.create({
      name,
      email,
      avatar,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
