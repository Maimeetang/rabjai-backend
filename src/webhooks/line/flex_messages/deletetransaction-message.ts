import dayjs from 'dayjs';
import 'dayjs/locale/th.js';
import buddhistEra from 'dayjs/plugin/buddhistEra.js';
import type { messagingApi } from '@line/bot-sdk';
import { TransactionFlexItem } from './types/transaction-flex-item.js';

dayjs.extend(buddhistEra);

export function deleteTransactionFlexMessage(
  transaction: TransactionFlexItem,
): messagingApi.FlexMessage {
  const isIncome = transaction.category.type === 'INCOME';
  const color = isIncome ? '#16A34A' : '#DC2626';

  return {
    type: 'flex',
    altText: 'ลบรายการสำเร็จ',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#DC2626',
        paddingAll: '24px',
        contents: [
          {
            type: 'text',
            text: 'ลบรายการสำเร็จ',
            weight: 'bold',
            size: 'lg',
            color: '#FFFFFF',
          },
          {
            type: 'text',
            text: 'รายการนี้ถูกลบออกจากบัญชีแล้ว',
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
                text: `${isIncome ? '+' : '-'} ${transaction.category.name}`,
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
            ],
          },
          {
            type: 'separator',
            margin: 'md',
            color: '#333333',
          },
          {
            type: 'text',
            text: 'รายการนี้ถูกลบเรียบร้อยแล้ว',
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
