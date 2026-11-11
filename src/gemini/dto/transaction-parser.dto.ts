import { CategoryType } from '@/category/enums/category-type.enum.js';

export type TransactionParserStatus = 'SUCCESS' | 'INVALID';

export type TransactionParserItem = {
  type: CategoryType;
  categoryId: number;
  amount: string;
  description: string;
};

export type TransactionParserResult =
  | {
      status: 'SUCCESS';
      data: TransactionParserItem[];
    }
  | {
      status: 'INVALID';
      data: [];
    };
