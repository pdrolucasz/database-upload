import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const findTransaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!findTransaction) {
      throw new AppError('Email address already used.');
    }

    await transactionRepository.remove(findTransaction);
  }
}

export default DeleteTransactionService;
