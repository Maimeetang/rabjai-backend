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

Your task is to understand the user's Thai message and extract ALL transaction information.

Available categories:
${JSON.stringify(categoryList)}

Rules:
1. Extract every transaction mentioned in the user's message.
2. Each transaction must have its own type, amount, description and categoryId.
3. Identify whether each transaction is INCOME or EXPENSE.
4. Extract the transaction amount.
5. Extract a short description of the transaction.
6. Select the most appropriate category from the available categories.
7. categoryId MUST be an ID from the available categories.
8. The category type MUST match the transaction type.
9. Never invent a category or categoryId.
10. If a transaction amount is missing or unclear, do not include that transaction.
11. If the message is unrelated to recording transactions, return INVALID.
12. If no valid transactions can be extracted, return INVALID.
13. Do not assume an amount if it is not explicitly provided.
14. Understand Thai shorthand, such as "ไข่ต้ม4บาท" and "กะเพรา 50".
15. Return SUCCESS when at least one valid transaction is extracted.
16. Return INVALID with an empty data array if no valid transaction is extracted.
17. Do not combine separate transactions into one transaction.
18. Preserve the order of transactions as mentioned by the user.

Examples:

User: "กะเพรา 50"
Expected:
{
  "status": "SUCCESS",
  "data": [
    {
      "type": "EXPENSE",
      "categoryId": 1,
      "amount": "50",
      "description": "กะเพรา"
    }
  ]
}

User: "กะเพรา 50 ไข่ต้ม 20"
Expected:
{
  "status": "SUCCESS",
  "data": [
    {
      "type": "EXPENSE",
      "categoryId": 1,
      "amount": "50",
      "description": "กะเพรา"
    },
    {
      "type": "EXPENSE",
      "categoryId": 1,
      "amount": "20",
      "description": "ไข่ต้ม"
    }
  ]
}

User: "เงินเดือน 30000 และซื้อข้าว 50"
Expected:
{
  "status": "SUCCESS",
  "data": [
    {
      "type": "INCOME",
      "categoryId": 2,
      "amount": "30000",
      "description": "เงินเดือน"
    },
    {
      "type": "EXPENSE",
      "categoryId": 1,
      "amount": "50",
      "description": "ซื้อข้าว"
    }
  ]
}

User: "กินข้าว"
Expected:
{
  "status": "INVALID",
  "data": []
}

User: "สวัสดี"
Expected:
{
  "status": "INVALID",
  "data": []
}

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
            data: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  type: {
                    type: 'STRING',
                    enum: ['INCOME', 'EXPENSE'],
                  },
                  categoryId: {
                    type: 'INTEGER',
                  },
                  amount: {
                    type: 'STRING',
                  },
                  description: {
                    type: 'STRING',
                  },
                },
                required: ['type', 'categoryId', 'amount', 'description'],
              },
            },
          },
          required: ['status', 'data'],
        },
      },
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty response');
    }

    return JSON.parse(response.text) as TransactionParserResult;
  }
}
