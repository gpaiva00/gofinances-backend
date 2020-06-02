import { getRepository } from 'typeorm';
import User from '../models/User';

interface Request {
  name: string;
  email: string;
  avatar: string;
}

class CreateUserService {
  public async execute({ name, email, avatar }: Request): Promise<User> {
    const usersRepository = getRepository(User);

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
