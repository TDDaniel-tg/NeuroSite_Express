# Быстрый деплой на Netlify

## Шаг 1: Подготовка Telegram бота

1. Создайте бота через @BotFather в Telegram
2. Получите токен бота
3. Создайте канал/группу и добавьте бота как администратора  
4. Получите Chat ID (см. `telegram-setup.md`)

## Шаг 2: Деплой на Netlify

### Автоматический деплой
1. Перейдите на [netlify.com](https://netlify.com)
2. Нажмите "New site from Git"
3. Подключите ваш Git репозиторий
4. Настройки деплоя:
   - Build command: `echo "Build completed"`
   - Publish directory: `.`
5. Нажмите "Deploy site"

### Добавление переменных окружения
1. В панели Netlify перейдите в "Site settings"
2. Откройте "Environment variables" 
3. Добавьте переменные:
   - `TELEGRAM_BOT_TOKEN` = ваш токен бота
   - `TELEGRAM_CHAT_ID` = ваш chat ID

### Альтернатива: Deploy кнопка
Нажмите на кнопку ниже для быстрого деплоя:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ваш-пользователь/ваш-репозиторий)

## Шаг 3: Настройка токенов в коде (НЕ рекомендуется для production)

Если не используете Netlify Functions, отредактируйте `script.js`:

```javascript
const TELEGRAM_CONFIG = {
    botToken: 'ваш_реальный_токен_бота',
    chatId: 'ваш_реальный_chat_id'
};
```

⚠️ **Важно**: Этот способ небезопасен для production!

## Шаг 4: Тестирование

1. Откройте ваш деплой
2. Заполните и отправьте форму
3. Проверьте, что сообщение пришло в Telegram

## Альтернативные платформы

### Vercel
1. Установите Vercel CLI: `npm i -g vercel`
2. Запустите: `vercel`
3. Добавьте переменные окружения в dashboard

### GitHub Pages (только с прямой отправкой)
1. Включите GitHub Pages в настройках репозитория
2. Настройте токены в `script.js`

### Netlify Drop
1. Перейдите на [netlify.com/drop](https://netlify.com/drop)
2. Перетащите папку с сайтом
3. Добавьте переменные окружения

## Troubleshooting

### Форма не отправляется
- Проверьте консоль браузера на ошибки
- Убедитесь, что токен и chat_id правильные
- Проверьте, что бот добавлен в канал как администратор

### CORS ошибки
- Используйте Netlify Functions (рекомендуется)
- Попробуйте другой CORS proxy
- Проверьте настройки браузера

### Netlify Functions не работают
- Убедитесь, что переменные окружения настроены
- Проверьте логи в Netlify dashboard
- Попробуйте локальный запуск: `netlify dev`

## Мониторинг

### Netlify Analytics
Включите в настройках сайта для отслеживания:
- Количество заявок
- Ошибки отправки
- Производительность

### Telegram Bot API
Проверяйте статус бота:
```
https://api.telegram.org/bot<ТОКЕН>/getMe
```

## Безопасность

- ✅ Используйте Netlify Functions для production
- ✅ Регулярно обновляйте токены
- ✅ Мониторьте логи на подозрительную активность
- ❌ Не публикуйте токены в открытом коде
- ❌ Не используйте прямую отправку для важных проектов 