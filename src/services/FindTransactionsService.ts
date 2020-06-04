import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface ServiceProps {
  monthParam?: any;
  userId: string;
}

class FindTransactionsService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public async execute({
    monthParam,
    userId,
  }: ServiceProps): Promise<Transaction[]> {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getUTCFullYear();
    const month = monthParam || currentMonth;

    const startDate = new Date(`${currentYear}-${month}-01`);
    const endDate = new Date(currentYear, Number(month), 0);

    const transactions = await this.transactionsRepository
      .createQueryBuilder('t')
      .orderBy('t.created_at', 'DESC')
      .innerJoinAndSelect('t.category', 'category')
      .andWhere('t.user_id = :userId', { userId })
      .andWhere(
        `t.created_at BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
      )
      .getMany();

    return transactions;
  }
}

export default FindTransactionsService;
