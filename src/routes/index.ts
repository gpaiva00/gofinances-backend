import { Router } from 'express';

import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import transactionsRouter from './transactions.routes';
import categoriesRouter from './categories.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/transactions', transactionsRouter);
routes.use('/categories', categoriesRouter);

export default routes;
