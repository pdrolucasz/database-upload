import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

import TransAcetionReporitory from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionReporitory = getCustomRepository(TransAcetionReporitory);
    const categoryReporitory = getRepository(Category);

    const { total } = await transactionReporitory.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('Total value exceeded');
    }

    let categoryId = await categoryReporitory.findOne({
      where: { title: category },
    });

    if (!categoryId) {
      categoryId = categoryReporitory.create({
        title: category,
      });

      await categoryReporitory.save(categoryId);
    }

    const transaction = transactionReporitory.create({
      title,
      value,
      type,
      category: categoryId,
    });

    await transactionReporitory.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
