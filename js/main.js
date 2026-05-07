import { calculateBookingPrice, calculateNights } from './booking.js';

document.addEventListener('DOMContentLoaded', function() {
    // Мобільне меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
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

            // --- НОВА ЛОГІКА ДЛЯ ЛАБИ №2 ---
            // 1. Рахуємо кількість ночей
            const nights = calculateNights(data['check-in'], data['check-out']);
            
            // 2. Рахуємо фінальну ціну
            // (припускаємо, що у формі є поле 'breakfast' та 'room-type')
            const hasBreakfast = formData.has('breakfast'); 
            const totalPrice = calculateBookingPrice(nights, data['room-type'], hasBreakfast);
            
            // Додаємо ціну до даних, які йдуть у "бекленд" (консоль)
            data.totalPrice = totalPrice;
            data.nightsCount = nights;

            console.log('Бронювання з розрахунком:', data);
            
            alert(`Дякуємо! Вартість проживання (${nights} ноч.): ${totalPrice}$. Ми зв'яжемося з вами.`);
            // --------------------------------
            
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
});
