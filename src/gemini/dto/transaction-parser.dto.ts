export type TransactionParserStatus = 'SUCCESS' | 'INVALID';

export type TransactionParserItem = {
  type: 'INCOME' | 'EXPENSE';
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
