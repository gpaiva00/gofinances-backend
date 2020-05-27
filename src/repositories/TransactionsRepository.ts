import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(transactions?: Transaction[]): Promise<Balance> {
    if (!transactions) {
      const currentYear = new Date().getUTCFullYear();
      const currentMonth = new Date().getMonth() + 1;

      const startDate = new Date(`${currentYear}-${currentMonth}-01`);
      const endDate = new Date(currentYear, currentMonth, 0);

      transactions = await this.createQueryBuilder('t')
        .orderBy('t.created_at', 'DESC')
        .innerJoinAndSelect('t.category', 'category')
        .andWhere(
          `t.created_at BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
        )
        .getMany();
    }

    const { outcome, income } = transactions.reduce(
      (acc, transaction) => {
        const transactionValue = Number(transaction.value);

        if (transaction.type === 'income') acc.income += transactionValue;
        else acc.outcome += transactionValue;

        return acc;
      },
      {
        outcome: 0,
        income: 0,
      },
    );

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
