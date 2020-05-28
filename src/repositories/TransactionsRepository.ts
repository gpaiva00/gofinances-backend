import { EntityRepository, Repository } from 'typeorm';

import FindTransactionsService from '../services/FindTransactionsService';
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
      const findTransactionsService = new FindTransactionsService(this);
      transactions = await findTransactionsService.execute();
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
