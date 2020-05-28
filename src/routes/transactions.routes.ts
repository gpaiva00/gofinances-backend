import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import FindTransactionsService from '../services/FindTransactionsService';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import AppError from '../errors/AppError';

const transactionsRouter = Router();

const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  try {
    const { month: monthParam } = request.query;

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const findTransactions = new FindTransactionsService(transactionsRepository);

    const transactions = await findTransactions.execute(monthParam);
    const balance = await transactionsRepository.getBalance(transactions);

    return response.json({ transactions, balance });
  } catch (error) {
    console.log(error);
    throw new AppError(
      'Não foi possível buscar as transações. Tente mais tarde.',
    );
  }
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category: categoryTitle } = request.body;
  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    categoryTitle,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransaction = new ImportTransactionsService();

    const fileName = request.file.filename;

    const transactions = await importTransaction.execute(fileName);

    return response.json(transactions);
  },
);

export default transactionsRouter;
