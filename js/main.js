import { bookingLogic } from './booking.js';
import posthog from 'posthog-js';
import * as Sentry from '@sentry/browser';

Sentry.init({
    dsn: 'https://6b1aafeadd495416e4d0e518c117f411@o4511403875696640.ingest.de.sentry.io/4511403882512464', 
    
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    
    tracesSampleRate: 1.0, 
    
    environment: 'production', // Production на релізі, development при тестуванні
});

posthog.init('phc_vUev2oheY3mkhF5EsEPeCPLajy49QP8FWzTxxGWSY6M6', {
    api_host: `${window.location.origin}/ingest`,
    ui_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only'
});

document.addEventListener('DOMContentLoaded', function() {

    const currentStatus = import.meta.env.VITE_APP_STATUS || 'Development (local)';
    const statusElement = document.getElementById('VITE_APP_STATUS');

    if (statusElement) {
        statusElement.textContent = currentStatus;
    }
    
    // Мобільне меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    const breakBtn = document.getElementById('break-btn');
        if (breakBtn) {
            breakBtn.addEventListener('click', function() {
                const posthogDistinctId = posthog.get_distinct_id();
                
                console.log('Передаємо в Sentry цей ID:', posthogDistinctId);

                Sentry.setUser({
                    id: posthogDistinctId,
                    username: `Гість (${posthogDistinctId ? posthogDistinctId.substring(0, 6) : 'unknown'})`
                });

                Sentry.setTag('user.segment', 'guest_landing');

                throw new Error('Sentry Test Error: Помилка');
            });
        }

    // Модальне вікно бронювання
    const modal = document.getElementById('booking-modal');
    const bookButtons = document.querySelectorAll('.btn-book');
    const modalClose = document.querySelector('.modal-close');
    const roomTypeSelect = document.getElementById('room-type');

    // Відкриття вікна
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            posthog.capture('booking_started', {
                source_button: 'rooms_section',
                room_type_selected: this.dataset.room
            });
            const roomType = this.dataset.room;
            if (roomTypeSelect) {
                roomTypeSelect.value = roomType;
            }
            modal.classList.add('active');
        });
    });

    // Закриття вікна
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }

    // Закриття при кліку на фон
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Встановлення мінімальної дати
    const checkIn = document.getElementById('check-in');
    const checkOut = document.getElementById('check-out');
    
    if (checkIn && checkOut) {
        const today = new Date().toISOString().split('T')[0];
        checkIn.min = today;
        checkOut.min = today;

        checkIn.addEventListener('change', function() {
            checkOut.min = this.value;
            if (checkOut.value && checkOut.value < this.value) {
                checkOut.value = this.value;
            }
        });
    }

        // Форма бронювання
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // 1. Розрахунок кількості ночей
            const nights = bookingLogic.calculateNights(data['check-in'], data['check-out']);
            const guests = parseInt(data['guests']) || 0;
            // Валідація
            if (nights <= 0 || guests <= 0) {
                alert('Будь ласка, заповніть коректні дати та кількість гостей.');
                return;
            }
            
            // 2. Підрахунок фінальної ціни
            const options = {
                hasBreakfast: formData.has('breakfast'),
                promoCode: data['promo-code']
            };
            const totalPrice = bookingLogic.calculateBookingPrice(nights, data['room-type'], guests, options);
            
            // Оновлюємо об'єкт даних для консолі
            data.totalPrice = totalPrice;
            data.nightsCount = nights;
            data.guestsCount = guests;

            console.log('Бронювання з розширеним розрахунком:', data);
            
            posthog.capture('booking_completed', {
                room_type: data['room-type'], 
                guests_count: guests,
                nights_count: nights,
                total_price: totalPrice,
                has_breakfast: formData.has('breakfast'),
                is_authenticated: false
            });

            alert(`Дякуємо! Вартість проживання (${nights} ноч., ${guests} гост.): ${totalPrice}$. Ми зв'яжемося з вами.`);
            
            modal.classList.remove('active');
            this.reset();
        });
    }

    // Контактна форма
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            console.log('Повідомлення:', data);
            
            alert('Дякуємо за ваше повідомлення! Ми відповімо найближчим часом.');
            this.reset();
        });
    }

    // Плавна прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    posthog.onFeatureFlags(() => {
        if (posthog.isFeatureEnabled('show-urgent-filter')) {
            const urgentBtn = document.getElementById('urgent-btn');
            if (urgentBtn) {
                urgentBtn.style.display = 'inline-block';
            }
        }
    });
});