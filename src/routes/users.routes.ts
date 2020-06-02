import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
  const { name, email, avatar } = req.body;
  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    avatar,
  });

  return res.json(user);
});

export default usersRouter;
