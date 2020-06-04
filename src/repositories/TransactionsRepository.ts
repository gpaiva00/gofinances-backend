import { EntityRepository, Repository } from 'typeorm';

import FindTransactionsService from '../services/FindTransactionsService';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface AppProps {
  transactions?: Transaction[];
  userId: string;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance({
    transactions,
    userId,
  }: AppProps): Promise<Balance> {
    if (!transactions) {
      const findTransactionsService = new FindTransactionsService(this);
      // eslint-disable-next-line no-param-reassign
      transactions = await findTransactionsService.execute({ userId });
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
