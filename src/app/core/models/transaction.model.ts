export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  status: TransactionStatus;
  createdAt?: string;
}

export interface TransactionRequest {
  accountId: string;
  amount: number;
}
