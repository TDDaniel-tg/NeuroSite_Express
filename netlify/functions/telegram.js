// Используем встроенный fetch в новых версиях Node.js
const fetch = globalThis.fetch || require('node-fetch');

exports.handler = async (event, context) => {
  // Разрешаем только POST запросы
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // CORS заголовки
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Обработка preflight запроса
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Проверяем наличие переменных окружения
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.error('Missing environment variables:', {
        hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
        hasChatId: !!process.env.TELEGRAM_CHAT_ID
      });
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Переменные окружения не настроены' })
      };
    }

    // Парсим данные из формы
    const { name, phone, email, tariff, date, message } = JSON.parse(event.body);

    // Проверяем обязательные поля
    if (!name || !phone || !email || !tariff) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Не все обязательные поля заполнены' })
      };
    }

    // Форматируем сообщение для Telegram
    const telegramMessage = `
🆕 НОВАЯ ЗАЯВКА NeuroSite Express

👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}
💰 Тариф: ${getTariffName(tariff)}
📅 Желаемая дата: ${date || 'Не указана'}
💬 Сообщение: ${message || 'Не указано'}

⏰ Дата заявки: ${new Date().toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })}
    `;

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          // Добавляем inline кнопки для быстрых действий
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "📧 Написать на email",
                  url: `mailto:${email}?subject=NeuroSite Express - Ответ на заявку`
                },
                {
                  text: "📞 Позвонить",
                  url: `tel:${phone.replace(/\D/g, '')}`
                }
              ],
              [
                {
                  text: "💬 Написать в Telegram",
                  url: `tg://msg?text=Здравствуйте, ${name}! Получили вашу заявку на ${getTariffName(tariff)}. Когда удобно обсудить детали?`
                }
              ]
            ]
          }
        })
      }
    );

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.text();
      console.error('Telegram API Error:', errorData);
      throw new Error(`Telegram API error: ${telegramResponse.status}`);
    }

    const result = await telegramResponse.json();

    if (!result.ok) {
      throw new Error(`Telegram returned error: ${result.description}`);
    }

    // Логируем успешную отправку (без персональных данных)
    console.log(`Заявка отправлена в Telegram. Message ID: ${result.result.message_id}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Заявка успешно отправлена!',
        messageId: result.result.message_id
      })
    };

  } catch (error) {
    console.error('Error sending to Telegram:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Ошибка при отправке заявки',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

// Функция для получения названия тарифа
function getTariffName(tariff) {
  const tariffs = {
    'express': 'ЭКСПРЕСС - 21 000 ₽',
    'business': 'БИЗНЕС - 42 000 ₽',
    'premium': 'ПРЕМИУМ - 65 000 ₽'
  };
  return tariffs[tariff] || tariff;
} 