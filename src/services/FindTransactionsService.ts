import { RequestParamHandler } from 'express';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';


class FindTransactionsService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public async execute(monthParam?: any): Promise<Transaction[]> {

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getUTCFullYear();
    const month = monthParam || currentMonth;

    const startDate = new Date(`${currentYear}-${month}-01`);
    const endDate = new Date(currentYear, Number(month), 0);

    const transactions = await this.transactionsRepository
      .createQueryBuilder('t')
      .orderBy('t.created_at', 'DESC')
      .innerJoinAndSelect('t.category', 'category')
      .andWhere(
        `t.created_at BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
      )
      .getMany();

    return transactions;
  }
}

export default FindTransactionsService;
