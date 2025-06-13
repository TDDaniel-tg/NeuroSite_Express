/* ==========================================================================
   JavaScript для NeuroSite Express
   Интерактивность и анимации
   ========================================================================== */

// DOM элементы
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const bookingModal = document.getElementById('bookingModal');
const videoModal = document.getElementById('videoModal');
const bookingForm = document.getElementById('bookingForm');
const lossesCount = document.getElementById('lossesCount');

// ==========================================================================
// 1. Мобильное меню
// ==========================================================================
let mobileMenuOpen = false;

navToggle.addEventListener('click', () => {
    mobileMenuOpen = !mobileMenuOpen;
    
    if (mobileMenuOpen) {
        navMenu.style.display = 'flex';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '80px';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = '#000000';
        navMenu.style.flexDirection = 'column';
        navMenu.style.padding = '2rem';
        navMenu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        navMenu.style.animation = 'slideDown 0.3s ease';
        navMenu.style.border = '1px solid #2F3336';
        navMenu.style.borderTop = 'none';
        
        // Анимация бургер-меню
        navToggle.classList.add('active');
        navToggle.children[0].style.transform = 'rotate(45deg) translateY(8px)';
        navToggle.children[1].style.opacity = '0';
        navToggle.children[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        navMenu.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            navMenu.style.display = 'none';
        }, 300);
        
        // Возврат бургер-меню
        navToggle.classList.remove('active');
        navToggle.children[0].style.transform = 'none';
        navToggle.children[1].style.opacity = '1';
        navToggle.children[2].style.transform = 'none';
    }
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            mobileMenuOpen = false;
            navMenu.style.display = 'none';
            navToggle.classList.remove('active');
            navToggle.children[0].style.transform = 'none';
            navToggle.children[1].style.opacity = '1';
            navToggle.children[2].style.transform = 'none';
        }
    });
});

// ==========================================================================
// 2. Sticky навигация при скролле
// ==========================================================================
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
    }
    
    lastScroll = currentScroll;
});

// ==========================================================================
// 3. Smooth Scroll для якорных ссылок
// ==========================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerOffset = 100;
            const elementPosition = targetSection.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================================================
// 4. Счетчик упущенных клиентов
// ==========================================================================
let losses = 0;
const updateLosses = () => {
    losses += Math.floor(Math.random() * 3) + 1;
    if (lossesCount) {
        lossesCount.textContent = losses;
    }
};

// Обновляем каждые 5 секунд
setInterval(updateLosses, 5000);

// ==========================================================================
// 5. Генерация календаря с зачеркнутыми днями
// ==========================================================================
const generateCalendar = () => {
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    const daysInMonth = 30;
    const currentDay = 15; // Предполагаем, что сегодня 15 число
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = i;
        
        // Стили для дней
        dayElement.style.padding = '0.5rem';
        dayElement.style.textAlign = 'center';
        dayElement.style.borderRadius = '4px';
        dayElement.style.position = 'relative';
        dayElement.style.minHeight = '35px';
        dayElement.style.display = 'flex';
        dayElement.style.alignItems = 'center';
        dayElement.style.justifyContent = 'center';
        dayElement.style.fontWeight = '500';
        
        if (i < currentDay) {
            // Прошедшие дни - зачеркнуты
            dayElement.style.color = '#6B7280'; // Серый цвет для зачеркнутых дней
            dayElement.style.background = 'rgba(255, 255, 255, 0.05)';
            
            // Добавляем красный крестик
            const cross = document.createElement('span');
            cross.textContent = '✕';
            cross.style.position = 'absolute';
            cross.style.color = '#ef4444'; // Красный цвет для крестика
            cross.style.fontSize = '1.25rem';
            cross.style.top = '50%';
            cross.style.left = '50%';
            cross.style.transform = 'translate(-50%, -50%)';
            cross.style.opacity = '0.8';
            dayElement.appendChild(cross);
        } else if (i === currentDay) {
            // Текущий день
            dayElement.style.background = '#FF6B35';
            dayElement.style.color = '#ffffff'; // Белый цвет для текущего дня
            dayElement.style.fontWeight = 'bold';
            dayElement.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.3)';
        } else {
            // Будущие дни
            dayElement.style.background = 'rgba(255, 255, 255, 0.1)';
            dayElement.style.color = '#E8EAED'; // Светлый цвет для будущих дней
            dayElement.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        }
        
        calendarGrid.appendChild(dayElement);
    }
};

// Генерируем календарь при загрузке
document.addEventListener('DOMContentLoaded', generateCalendar);

// ==========================================================================
// 6. FAQ Аккордеон
// ==========================================================================
function toggleFaq(button) {
    const faqItem = button.closest('.faq-item');
    const allFaqItems = document.querySelectorAll('.faq-item');
    
    // Закрываем все остальные
    allFaqItems.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });
    
    // Переключаем текущий
    faqItem.classList.toggle('active');
}

// ==========================================================================
// 7. Модальные окна
// ==========================================================================
function openBookingModal(tariff = 'express') {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Устанавливаем выбранный тариф
    const tariffSelect = document.getElementById('tariff');
    if (tariffSelect) {
        tariffSelect.value = tariff;
    }
}

function closeModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showVideo() {
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Автоматически запускаем видео
    const video = document.getElementById('timelapseVideo');
    if (video) {
        // Небольшая задержка для правильного отображения модального окна
        setTimeout(() => {
            video.play().catch(error => {
                console.log('Автовоспроизведение заблокировано браузером:', error);
            });
        }, 300);
    }
}

function closeVideoModal() {
    videoModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Останавливаем и сбрасываем видео
    const video = document.getElementById('timelapseVideo');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
}

// Закрытие модалок по клику вне контента
[bookingModal, videoModal].forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Если это видео модальное окно, останавливаем видео
                if (modal === videoModal) {
                    const video = document.getElementById('timelapseVideo');
                    if (video) {
                        video.pause();
                        video.currentTime = 0;
                    }
                }
            }
        });
    }
});

// ==========================================================================
// 8. Обработка формы заказа
// ==========================================================================

// Настройки Telegram для отправки заявок
const TELEGRAM_CONFIG = {
    botToken: '7672901413:AAHd0SfBJC3HmwwYxhU_Dwtjzch-cl8GwgE',
    chatId: '-1002568274832'
};

// Функция отправки сообщения в Telegram (простая версия)
async function sendToTelegram(formData) {
    try {
        // Проверяем что токены настроены
        if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId || 
            TELEGRAM_CONFIG.botToken.includes('ВАШ_') || TELEGRAM_CONFIG.chatId.includes('ВАШ_')) {
            alert('Ошибка: Не настроены токены Telegram! Обратитесь к администратору.');
            return false;
        }

        // Формируем сообщение
        const message = `🆕 НОВАЯ ЗАЯВКА NeuroSite Express

👤 Имя: ${formData.name}
📞 Телефон: ${formData.phone}
📧 Email: ${formData.email}
💰 Тариф: ${getTariffName(formData.tariff)}
📅 Желаемая дата: ${formData.date || 'Не указана'}
💬 Сообщение: ${formData.message || 'Не указано'}

⏰ Дата заявки: ${new Date().toLocaleString('ru-RU')}`;

        // Пробуем несколько способов отправки
        let response;
        
        // Способ 1: Прямой запрос (работает на продакшене)
        try {
            const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
            response = await fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Прямой запрос успешен:', result);
                return result.ok;
            }
        } catch (directError) {
            console.log('Прямой запрос не сработал, пробуем proxy...');
        }
        
        // Способ 2: Через корс прокси
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
        
        response = await fetch(proxyUrl + encodeURIComponent(telegramUrl), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Telegram response:', result);
        return result.ok;

    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        
        // Пробуем альтернативный proxy
        try {
            const altProxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
            
            const altResponse = await fetch(altProxyUrl + telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.chatId,
                    text: `🆕 НОВАЯ ЗАЯВКА NeuroSite Express

👤 Имя: ${formData.name}
📞 Телефон: ${formData.phone}
📧 Email: ${formData.email}
💰 Тариф: ${getTariffName(formData.tariff)}
📅 Желаемая дата: ${formData.date || 'Не указана'}
💬 Сообщение: ${formData.message || 'Не указано'}

⏰ Дата заявки: ${new Date().toLocaleString('ru-RU')}`,
                    parse_mode: 'HTML'
                })
            });
            
            if (altResponse.ok) {
                const altResult = await altResponse.json();
                return altResult.ok;
            }
        } catch (altError) {
            console.error('Альтернативный proxy тоже не сработал:', altError);
        }
        
        return false;
    }
}

// Функция для получения названия тарифа
function getTariffName(tariff) {
    const tariffs = {
        'express': 'ЭКСПРЕСС - 21 000 ₽',
        'business': 'БИЗНЕС - 42 000 ₽',
        'premium': 'ПРЕМИУМ - 65 000 ₽'
    };
    return tariffs[tariff] || tariff;
}

if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Собираем данные формы
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            tariff: document.getElementById('tariff').value,
            date: document.getElementById('date').value,
            message: document.getElementById('message').value
        };
        
        // Показываем уведомление об отправке
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Отправляем...';
        submitButton.disabled = true;
        
        try {
            const success = await sendToTelegram(formData);
            
            if (success) {
                // Показываем успешное сообщение
                alert('✅ Спасибо за заявку! Мы получили ваши данные и свяжемся с вами в течение 15 минут.');
                
                // Очищаем форму
                bookingForm.reset();
                
                // Закрываем модалку
                closeModal();
            } else {
                // Показываем сообщение с альтернативным способом связи
                alert('⚠️ Произошла техническая ошибка при отправке заявки.\n\nПожалуйста, напишите нам напрямую в Telegram: @bogdan_neuroimpulse\n\nИли отправьте заявку на email: info@neurosite.ru');
            }
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую в Telegram: @bogdan_neuroimpulse');
        } finally {
            // Возвращаем кнопку в исходное состояние
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// ==========================================================================
// 9. Анимации при скролле
// ==========================================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Анимация счетчиков
            if (entry.target.classList.contains('metric-value')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Наблюдаем за элементами
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем класс для анимации
    const animatedElements = document.querySelectorAll(
        '.problem-card, .portfolio-card, .pricing-card, .timeline-item, .metric, .guarantee'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('scroll-animate');
        scrollObserver.observe(el);
    });
});

// ==========================================================================
// 10. Анимация счетчиков
// ==========================================================================
function animateCounter(element) {
    const target = element.textContent;
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    // Запускаем только если это число
    if (!isNaN(target)) {
        updateCounter();
    }
}

// ==========================================================================
// 11. Маска для телефона
// ==========================================================================
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
            formattedValue = '+7 ';
            if (value.length > 1) {
                formattedValue += '(' + value.substring(1, 4);
            }
            if (value.length >= 4) {
                formattedValue += ') ' + value.substring(4, 7);
            }
            if (value.length >= 7) {
                formattedValue += '-' + value.substring(7, 9);
            }
            if (value.length >= 9) {
                formattedValue += '-' + value.substring(9, 11);
            }
        }
        
        e.target.value = formattedValue;
    });
}

// ==========================================================================
// 12. Установка минимальной даты в календаре
// ==========================================================================
const dateInput = document.getElementById('date');
if (dateInput) {
    // Устанавливаем минимальную дату - завтра
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    
    // Устанавливаем максимальную дату - через месяц
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    dateInput.max = maxDate.toISOString().split('T')[0];
}

// ==========================================================================
// 13. Анимация слотов
// ==========================================================================
const slotsCount = document.querySelector('.slots-count');
if (slotsCount) {
    // Уменьшаем количество слотов каждые 30 минут
    setInterval(() => {
        let currentSlots = parseInt(slotsCount.textContent);
        if (currentSlots > 1) {
            slotsCount.textContent = currentSlots - 1;
            
            // Добавляем анимацию
            slotsCount.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                slotsCount.style.animation = '';
            }, 500);
        }
    }, 1800000); // 30 минут
}

// ==========================================================================
// 14. Автовоспроизведение основного видео
// ==========================================================================
const mainVideo = document.getElementById('mainTimelapseVideo');
if (mainVideo) {
    mainVideo.addEventListener('click', () => {
        if (mainVideo.paused) {
            mainVideo.play().catch(error => {
                console.log('Автовоспроизведение заблокировано браузером:', error);
            });
        }
    });
    
    // Добавляем стиль курсора для основного видео
    mainVideo.style.cursor = 'pointer';
}

// ==========================================================================
// 15. Preloader (опционально)
// ==========================================================================
window.addEventListener('load', () => {
    // Убираем прелоадер если есть
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
});

// ==========================================================================
// 15. Дополнительные анимации
// ==========================================================================
// Параллакс эффект для hero секции
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < 800) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled * 0.001);
    }
});

// ==========================================================================
// Консольное сообщение
// ==========================================================================
console.log('%c🚀 NeuroSite Express', 'font-size: 24px; font-weight: bold; color: #FF6B35;');
console.log('%cСоздаем сайты за 4 часа!', 'font-size: 16px; color: #4A90E2;');
console.log('%cНапишите нам: info@neurosite-express.ru', 'font-size: 14px; color: #2C3E50;'); 