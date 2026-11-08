import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { Category } from '@/category/entities/category.entity.js';
import { TransactionParserResult } from './dto/transaction-parser.dto.js';

@Injectable()
export class GeminiService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.getOrThrow<string>('GEMINI_API_KEY'),
    });
  }

  async parseTransaction(
    message: string,
    categories: Category[],
  ): Promise<TransactionParserResult> {
    const categoryList = categories.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type,
    }));

    const prompt = `
You are a transaction parser for a Thai expense tracking application.

Your task is to understand the user's Thai message and extract transaction information.

Available categories:
${JSON.stringify(categoryList)}

Rules:
1. Identify whether the transaction is INCOME or EXPENSE.
2. Extract the transaction amount.
3. Extract a short description of the transaction.
4. Select the most appropriate category from the available categories.
5. categoryId MUST be an ID from the available categories.
6. The category type MUST match the transaction type.
7. Never invent a category or categoryId.
8. If the amount is missing or unclear, return INVALID.
9. If the message is unrelated to recording a transaction, return INVALID.
10. If you cannot confidently determine the transaction type or category, return INVALID.
11. Do not assume an amount if it is not explicitly provided.
12. Understand Thai shorthand, such as "ไข่ต้ม4บาท" and "กะเพรา 50".
13. Return SUCCESS only when all transaction information is confidently extracted.
14. For INVALID, set type, categoryId, amount and description to null.

Examples:

User: "กะเพรา 50"
Expected: SUCCESS, EXPENSE, amount 50, description "กะเพรา"

User: "ไข่ต้ม4บาท"
Expected: SUCCESS, EXPENSE, amount 4, description "ไข่ต้ม"

User: "เงินเดือน 60000"
Expected: SUCCESS, INCOME, amount 60000, description "เงินเดือน"

User: "กินข้าว"
Expected: INVALID

User: "สวัสดี"
Expected: INVALID

User message:
${message}
`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'OBJECT',
          properties: {
            status: {
              type: 'STRING',
              enum: ['SUCCESS', 'INVALID'],
            },
            type: {
              type: ['STRING', 'NULL'],
              enum: ['INCOME', 'EXPENSE', null],
            },
            categoryId: {
              type: ['INTEGER', 'NULL'],
            },
            amount: {
              type: ['STRING', 'NULL'],
            },
            description: {
              type: ['STRING', 'NULL'],
            },
          },
          required: ['status', 'type', 'categoryId', 'amount', 'description'],
        },
      },
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty response');
    }

    return JSON.parse(response.text) as TransactionParserResult;
  }
}
