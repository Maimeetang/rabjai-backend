import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';

import { TransactionController } from './transaction.controller.js';
import { TransactionService } from './transaction.service.js';
import type { AuthenticatedRequest } from '../auth/interface/request.interface.js';
import type { CreateTransactionDto } from './dto/create-transaction.dto.js';
import type { UpdateTransactionDto } from './dto/update-transaction.dto.js';

describe('TransactionController', () => {
  let controller: TransactionController;

  const mockTransactionService = {
    create: vi.fn(),
    update: vi.fn(),
    findBelongToAccount: vi.fn(),
  };

  const mockRequest = {
    user: {
      sub: 'line-user-id',
    },
  } as AuthenticatedRequest;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const categoryId = 1;

      const dto: CreateTransactionDto = {
        amount: '100',
        description: 'Soap',
        transactionDate: '2026-11-08',
      };

      const expectedResult = { id: 1 };

      mockTransactionService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(categoryId, mockRequest, dto);

      expect(mockTransactionService.create).toHaveBeenCalledWith(
        categoryId,
        'line-user-id',
        dto,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const id = 1;

      const dto: UpdateTransactionDto = {
        amount: '200',
        description: 'Shampoo',
      };

      const expectedResult = { id: 1, amount: '200' };

      mockTransactionService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, dto, mockRequest);

      expect(mockTransactionService.update).toHaveBeenCalledWith(
        'line-user-id',
        id,
        dto,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByAccount', () => {
    it('should find transactions belonging to an account', async () => {
      const accountId = 1;
      const startDate = '2026-11-01';
      const endDate = '2026-11-30';
      const expectedResult = [{ id: 1 }, { id: 2 }];

      mockTransactionService.findBelongToAccount.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findByAccount(
        accountId,
        startDate,
        endDate,
        mockRequest,
      );

      expect(mockTransactionService.findBelongToAccount).toHaveBeenCalledWith(
        accountId,
        'line-user-id',
        startDate,
        endDate,
      );

      expect(result).toEqual(expectedResult);
    });
  });
});
