import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateUserService from '../services/CreateUserService';
import AuthenticateUserService from '../services/AuthenticateUserService';

import User from '../models/User';

const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
  const { name, email, avatar } = req.body;
  const usersRepository = getRepository(User);

  const checkUserExists = await usersRepository.findOne({
    where: { email },
  });

  // if user exists, do login
  if (checkUserExists) {
    const authenticateUser = new AuthenticateUserService();
    const { user, token } = await authenticateUser.execute({ email });

    return res.json({ user, token });
  }

  // else create it
  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    avatar,
  });

  return res.json(user);
});

export default usersRouter;
