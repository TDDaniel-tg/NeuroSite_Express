# Настройка Telegram бота для получения заявок

## Шаг 1: Создание Telegram бота

1. **Откройте Telegram** и найдите бота `@BotFather`
2. **Отправьте команду** `/newbot`
3. **Введите имя бота** (например: "NeuroSite Express Bot")
4. **Введите username бота** (например: "neurosite_express_bot")
5. **Скопируйте токен бота** - это строка вида `1234567890:AABBCCDDEEFFgghhiijjkkllmmnnoopp`

## Шаг 2: Создание канала или группы для получения заявок

### Вариант А: Создание канала
1. Создайте новый канал в Telegram
2. Добавьте вашего бота как администратора канала
3. Получите ID канала (см. шаг 3)

### Вариант Б: Использование личных сообщений
1. Найдите вашего бота в Telegram
2. Отправьте ему любое сообщение
3. Получите ваш chat_id (см. шаг 3)

## Шаг 3: Получение Chat ID

### Способ 1: Через браузер
1. Откройте в браузере:
   ```
   https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
   ```
   (замените `<ВАШ_ТОКЕН>` на реальный токен)

2. Отправьте сообщение в канал/боту
3. Обновите страницу в браузере
4. Найдите в JSON ответе поле `"chat":{"id":-1001234567890}`
5. Скопируйте это число (включая минус, если есть)

### Способ 2: Через специального бота
1. Найдите бота `@userinfobot`
2. Добавьте его в ваш канал
3. Он отправит ID канала

## Шаг 4: Настройка в коде

Откройте файл `script.js` и замените значения в объекте `TELEGRAM_CONFIG`:

```javascript
const TELEGRAM_CONFIG = {
    botToken: '1234567890:AABBCCDDEEFFgghhiijjkkllmmnnoopp', // Ваш токен
    chatId: '-1001234567890' // Ваш chat ID
};
```

## Шаг 5: Проблемы с CORS

Если у вас возникают проблемы с CORS (блокировка браузером), используйте один из альтернативных методов:

### Метод 1: Netlify Functions (рекомендуется)
1. Создайте аккаунт на [Netlify](https://netlify.com)
2. Создайте папку `netlify/functions/`
3. Создайте файл `telegram.js`:

```javascript
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, phone, email, tariff, date, message } = JSON.parse(event.body);
  
  const telegramMessage = `
🆕 НОВАЯ ЗАЯВКА NeuroSite Express

👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email}
💰 Тариф: ${tariff}
📅 Желаемая дата: ${date}
💬 Сообщение: ${message || 'Не указано'}

⏰ Дата заявки: ${new Date().toLocaleString('ru-RU')}
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: telegramMessage
      })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

4. Добавьте переменные окружения в Netlify:
   - `TELEGRAM_BOT_TOKEN` = ваш токен
   - `  ` = ваш chat ID

### Метод 2: Использование webhook
Настройте webhook для вашего бота:
```
https://api.telegram.org/bot<ВАШ_ТОКЕН>/setWebhook?url=https://ваш-сайт.com/webhook
```

### Метод 3: Vercel Functions
Аналогично Netlify, но через [Vercel](https://vercel.com)

## Тестирование

1. Откройте ваш сайт
2. Заполните форму
3. Отправьте заявку
4. Проверьте, что сообщение пришло в Telegram
ыовралыварвоаа
## Безопасность

⚠️ **ВАЖНО:** Никогда не публикуйте токен бота в открытом коде!

- Используйте переменные окружения
- Для production используйте serverless функции
- Регулярно обновляйте токены

## Дополнительные возможности

### Форматирование сообщений
Можете использовать HTML или Markdown разметку:
```javascript
parse_mode: 'HTML' // или 'Markdown'
```

### Кнопки в сообщениях
```javascript
reply_markup: {
  inline_keyboard: [[
    { text: "Ответить клиенту", url: `mailto:${email}` },
    { text: "Позвонить", url: `tel:${phone}` }
  ]]
}
```

### Уведомления
```javascript
disable_notification: false // true для беззвучной отправки
```

## Альтернативные сервисы

Если Telegram не подходит, можете использовать:
- Webhook.site для тестирования
- Zapier для интеграций
- IFTTT для автоматизации
- Собственный сервер с API

## Поддержка

Если возникают проблемы:
1. Проверьте правильность токена и chat_id
2. Убедитесь, что бот добавлен в канал как администратор
3. Проверьте консоль браузера на ошибки
4. Попробуйте отправить тестовое сообщение через браузер 