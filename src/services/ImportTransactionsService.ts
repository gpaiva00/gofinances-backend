import { getRepository, getCustomRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import parseCsv from '../helpers/parseCsv';

import uploadConfig from '../config/upload';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const filePath = path.join(uploadConfig.directory, fileName);

    const { transactions, categories } = await parseCsv(filePath);

    const existentCategories = await categoriesRepository.find({
      where: {
        title: { $in: categories },
      },
    });

    const addCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    const unexistentCategories = await categories
      .filter(category => !addCategoriesTitles.includes(category))
      .filter((category, index, self) => self.indexOf(category) === index);

    const newCategories = categoriesRepository.create(
      unexistentCategories.map(title => ({ title })),
    );

    await categoriesRepository.save(newCategories);

    const allCategories = [...existentCategories, ...newCategories];

    const newTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category_id: allCategories.find(
          category => category.title === transaction.category,
        )?.title,
      })),
    );

    await transactionsRepository.save(newTransactions);

    await fs.promises.unlink(filePath);

    return newTransactions;
  }
}

export default ImportTransactionsService;
