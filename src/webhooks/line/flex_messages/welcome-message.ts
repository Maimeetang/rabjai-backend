import type { messagingApi } from '@line/bot-sdk';

export function welcomeMessage(liffUrl: string): messagingApi.FlexMessage {
  return {
    type: 'flex',
    altText: 'ยินดีต้อนรับสู่ RubJai!',
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#176B57',
        paddingAll: '20px',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: 'Rub Jai',
            color: '#FFFFFF',
            weight: 'bold',
            size: 'xl',
          },
          {
            type: 'text',
            text: 'ยินดีต้อนรับ! 👋',
            color: '#FFFFFF',
            weight: 'bold',
            size: 'xxl',
            margin: 'lg',
          },
          {
            type: 'text',
            text: 'ผู้ช่วยจัดการรายรับรายจ่ายของคุณ',
            color: '#E0F2EA',
            size: 'sm',
            wrap: true,
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'lg',
        contents: [
          {
            type: 'text',
            text: 'จัดการเงินให้ง่ายขึ้นในทุกวัน',
            weight: 'bold',
            size: 'md',
            wrap: true,
          },
          {
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            contents: [
              { type: 'text', text: '📖', flex: 0 },
              {
                type: 'text',
                text: 'บันทึกรายรับและรายจ่าย',
                size: 'sm',
                wrap: true,
              },
            ],
          },
          {
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            contents: [
              { type: 'text', text: '👥', flex: 0 },
              {
                type: 'text',
                text: 'จัดการบัญชีส่วนตัวและบัญชีกลุ่ม',
                size: 'sm',
                wrap: true,
              },
            ],
          },
          {
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            contents: [
              { type: 'text', text: '📊', flex: 0 },
              {
                type: 'text',
                text: 'สรุปภาพรวมค่าใช้จ่าย',
                size: 'sm',
                wrap: true,
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#176B57',
            action: {
              type: 'uri',
              label: 'เริ่มต้นใช้งาน',
              uri: liffUrl,
            },
          },
        ],
      },
    },
  };
}
