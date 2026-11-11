import dayjs from 'dayjs';
import 'dayjs/locale/th.js';
import buddhistEra from 'dayjs/plugin/buddhistEra.js';
import type { messagingApi } from '@line/bot-sdk';
import { TransactionFlexItem } from './types/transaction-flex-item.js';
import { CategoryType } from '@/common/enums/category-type.enum.js';

dayjs.extend(buddhistEra);

export function createTransactionFlexMessage(
  transactions: TransactionFlexItem[],
): messagingApi.FlexMessage {
  const groups = new Map<string, TransactionFlexItem[]>();

  // Group transactions by category
  for (const transaction of transactions) {
    const key = `${transaction.category.type}:${transaction.category.name}`;

    const group = groups.get(key) ?? [];
    group.push(transaction);

    groups.set(key, group);
  }

  const categorySections: messagingApi.FlexComponent[] = Array.from(
    groups.values(),
  ).flatMap((group, index) => {
    const { category } = group[0];
    const isIncome = category.type === CategoryType.INCOME;

    const color = isIncome ? '#16A34A' : '#DC2626';

    const section: messagingApi.FlexBox = {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'box',
          layout: 'horizontal',
          alignItems: 'center',
          contents: [
            {
              type: 'box',
              layout: 'vertical',
              flex: 0,
              backgroundColor: color,
              cornerRadius: '20px',
              paddingTop: '3px',
              paddingBottom: '3px',
              paddingStart: '12px',
              paddingEnd: '12px',
              contents: [
                {
                  type: 'text',
                  text: isIncome ? 'รายรับ' : 'รายจ่าย',
                  color: '#FFFFFF',
                  size: 'xxs',
                  align: 'center',
                },
              ],
            },
            {
              type: 'text',
              text: `${isIncome ? '+' : '-'} ${category.name}`,
              size: 'md',
              weight: 'bold',
              color: '#444444',
              flex: 0,
              margin: 'sm',
            },
          ],
        },
        {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          margin: 'xxl',
          contents: group.map((transaction) => ({
            type: 'box',
            layout: 'horizontal',
            alignItems: 'center',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                flex: 1,
                contents: [
                  {
                    type: 'text',
                    text: dayjs(transaction.transactionDate)
                      .locale('th')
                      .format('D MMM BBBB'),
                    size: 'xxs',
                  },
                  {
                    type: 'text',
                    text: transaction.description,
                    size: 'md',
                  },
                ],
              },
              {
                type: 'box',
                layout: 'horizontal',
                alignItems: 'center',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: `${isIncome ? '+' : '-'}฿${Number(
                      transaction.amount,
                    ).toLocaleString('th-TH')}`,
                    size: 'sm',
                    color,
                    weight: 'regular',
                    align: 'end',
                    adjustMode: 'shrink-to-fit',
                    flex: 1,
                    wrap: false,
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    backgroundColor: '#E2E8F0',
                    cornerRadius: '10px',
                    width: '32px',
                    height: '32px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    contents: [
                      {
                        type: 'text',
                        text: '✏️',
                        size: 'sm',
                      },
                    ],
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    backgroundColor: '#E2E8F0',
                    cornerRadius: '10px',
                    width: '32px',
                    height: '32px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    action: {
                      type: 'postback',
                      label: 'ลบรายการ',
                      data: `action=delete_transaction&id=${transaction.id}`,
                    },
                    contents: [
                      {
                        type: 'text',
                        text: '❌',
                        size: 'sm',
                      },
                    ],
                  },
                ],
              },
            ],
          })),
        },
      ],
    };

    return index === 0
      ? [section]
      : [
          {
            type: 'separator',
            margin: 'md',
            color: '#333333',
          },
          section,
        ];
  });

  const budgetPlaceholder: messagingApi.FlexBox = {
    type: 'box',
    layout: 'horizontal',
    margin: 'xl',
    alignItems: 'center',
    contents: [
      {
        type: 'text',
        text: 'รอบงบ',
        size: 'md',
        weight: 'bold',
        color: '#444444',
        flex: 1,
      },
      {
        type: 'box',
        layout: 'vertical',
        flex: 2,
        contents: [
          {
            type: 'text',
            text: 'กำลังพัฒนา...',
            size: 'sm',
            color: '#999999',
          },
        ],
      },
    ],
  };

  return {
    type: 'flex',
    altText: 'บันทึกรายการสำเร็จ',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#16A34A',
        paddingAll: '24px',
        contents: [
          {
            type: 'text',
            text: 'บันทึกรายการสำเร็จ',
            weight: 'bold',
            size: 'lg',
            color: '#FFFFFF',
          },
          {
            type: 'text',
            text: 'อย่าลืมตรวจสอบรายการที่บันทึกด้วยนะครับ',
            size: 'sm',
            margin: 'md',
            color: '#FFFFFF',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'xl',
        contents: [
          ...categorySections,
          {
            type: 'separator',
            margin: 'md',
            color: '#333333',
          },
          budgetPlaceholder,
          {
            type: 'text',
            text: 'กด ✏️ เพื่อแก้ไขรายการได้',
            size: 'sm',
            color: '#555555',
            align: 'start',
            margin: 'xl',
          },
        ],
      },
    },
  };
}
