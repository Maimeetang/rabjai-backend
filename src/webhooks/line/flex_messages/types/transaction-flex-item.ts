import { CategoryType } from '../../../../common/enums/category-type.enum.js';

export type TransactionFlexItem = {
  id: number;
  amount: string;
  description: string;
  transactionDate: Date;
  category: {
    name: string;
    type: CategoryType;
  };
};
