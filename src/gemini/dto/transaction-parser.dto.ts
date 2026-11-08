export type TransactionParserStatus = 'SUCCESS' | 'INVALID';

export interface TransactionParserResult {
  status: TransactionParserStatus;
  type: 'INCOME' | 'EXPENSE' | null;
  categoryId: number | null;
  amount: string | null;
  description: string | null;
}
