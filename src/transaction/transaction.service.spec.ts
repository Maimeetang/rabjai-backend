import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { TransactionService } from './transaction.service.js';
import { Transaction } from './entities/transaction.entity.js';
import { AuthorizationService } from '../common/authorization/authorization.service.js';
import type { CreateTransactionDto } from './dto/create-transaction.dto.js';
import type { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { Between } from 'typeorm';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockTransactionRepository = {
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
    find: vi.fn(),
  };

  const mockAuthorizationService = {
    verifyCategory: vi.fn(),
    verifyAccountOwner: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: AuthorizationService,
          useValue: mockAuthorizationService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // findOne
  describe('findOne', () => {
    it('should return a transaction', async () => {
      const expectedResult = { id: 1 } as Transaction;

      mockTransactionRepository.findOne.mockResolvedValue(expectedResult);

      const result = await service.findOne(1);

      expect(mockTransactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: {
          user: false,
          account: false,
        },
      });

      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException when transaction not found', async () => {
      mockTransactionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  // create
  describe('create', () => {
    it('should create a transaction', async () => {
      const categoryId = 1;
      const userId = 'line-user-id';

      const dto: CreateTransactionDto = {
        amount: '100',
        description: 'Soap',
        transactionDate: '2026-11-08',
      };

      const category = {
        id: categoryId,
        accountId: 10,
      };

      const payload = {
        ...dto,
        categoryId,
        userId,
      };

      const transaction = {
        id: 1,
        accountId: 10,
        categoryId,
        userId,
        amount: dto.amount,
        description: dto.description,
        transactionDate: new Date(dto.transactionDate),
      } as Transaction;

      mockAuthorizationService.verifyCategory.mockResolvedValue(category);
      mockAuthorizationService.verifyAccountOwner.mockResolvedValue(undefined);
      mockTransactionRepository.create.mockReturnValue(transaction);
      mockTransactionRepository.save.mockResolvedValue(transaction);

      const result = await service.create(categoryId, userId, dto);

      expect(mockAuthorizationService.verifyCategory).toHaveBeenCalledWith(
        categoryId,
      );

      expect(mockAuthorizationService.verifyAccountOwner).toHaveBeenCalledWith(
        category.accountId,
        userId,
      );

      expect(mockTransactionRepository.create).toHaveBeenCalledWith(payload);
      expect(mockTransactionRepository.save).toHaveBeenCalledWith(transaction);
      expect(result).toEqual(transaction);
    });
  });

  // update
  describe('update', () => {
    it('should update a transaction', async () => {
      const userId = 'line-user-id';
      const id = 1;

      const transaction = {
        id,
        accountId: 10,
      } as Transaction;

      const dto: UpdateTransactionDto = {
        amount: '200',
        description: 'Shampoo',
      };

      const updatedTransaction = {
        ...transaction,
        ...dto,
      } as Transaction;

      mockTransactionRepository.findOne
        .mockResolvedValueOnce(transaction)
        .mockResolvedValueOnce(updatedTransaction);

      mockAuthorizationService.verifyAccountOwner.mockResolvedValue(undefined);
      mockTransactionRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(userId, id, dto);

      expect(mockTransactionRepository.findOne).toHaveBeenNthCalledWith(1, {
        where: { id },
        relations: {
          user: false,
          account: true,
        },
      });

      expect(mockAuthorizationService.verifyAccountOwner).toHaveBeenCalledWith(
        transaction.accountId,
        userId,
      );

      expect(mockTransactionRepository.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(updatedTransaction);
    });

    it('should throw BadRequestException when category belongs to another account', async () => {
      const transaction = {
        id: 1,
        accountId: 10,
      } as Transaction;

      const dto = {
        categoryId: 2,
      } as UpdateTransactionDto;

      mockTransactionRepository.findOne.mockResolvedValue(transaction);
      mockAuthorizationService.verifyAccountOwner.mockResolvedValue(undefined);
      mockAuthorizationService.verifyCategory.mockResolvedValue({
        id: 2,
        accountId: 20,
      });

      await expect(service.update('line-user-id', 1, dto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockTransactionRepository.update).not.toHaveBeenCalled();
    });
  });

  // findBelongToAccount
  describe('findBelongToAccount', () => {
    it('should return transactions belonging to an account', async () => {
      const accountId = 10;
      const userId = 'line-user-id';
      const startDate = '2026-11-01';
      const endDate = '2026-11-30';

      const expectedResult = [{ id: 1 }, { id: 2 }];

      mockAuthorizationService.verifyAccountOwner.mockResolvedValue(undefined);
      mockTransactionRepository.find.mockResolvedValue(expectedResult);

      const result = await service.findBelongToAccount(
        accountId,
        userId,
        startDate,
        endDate,
      );

      expect(mockAuthorizationService.verifyAccountOwner).toHaveBeenCalledWith(
        accountId,
        userId,
      );

      expect(mockTransactionRepository.find).toHaveBeenCalledWith({
        where: {
          accountId,
          transactionDate: Between(
            new Date(`${startDate}T00:00:00`),
            new Date(`${endDate}T23:59:59.999`),
          ),
        },
        relations: {
          category: true,
        },
        order: {
          transactionDate: 'DESC',
        },
      });

      expect(result).toEqual(expectedResult);
    });
  });
});
