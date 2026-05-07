import { expect, test, describe, vi } from 'vitest';
import * as bookingLogic from './js/booking.js'; // Імпортуємо все для мокінгу

describe('Unit-тести бізнес-логіки бронювання готелю', () => {

    // Тест 1: Базовий розрахунок (позитивний сценарій)
    test('Має правильно рахувати стандартний номер без сніданку', () => {
        const result = bookingLogic.calculateBookingPrice(3, 'standard', false);
        expect(result).toBe(300); // Assertion: перевірка очікуваного результату
    });

    // Тест 2: Розрахунок для Deluxe (логіка множників)
    test('Має враховувати підвищену вартість для номеру Deluxe', () => {
        const result = bookingLogic.calculateBookingPrice(2, 'deluxe', false);
        expect(result).toBe(300); // 2 ночі * 150$
    });

    // Тест 3: Додаткові послуги
    test('Має додавати вартість сніданку до кожної ночі', () => {
        const result = bookingLogic.calculateBookingPrice(1, 'standard', true);
        expect(result).toBe(120); // 100$ + 20$
    });

    // Тест 4: Бізнес-правило знижки (Межа 7 ночей)
    test('Має застосовувати знижку 10% при бронюванні від 7 ночей', () => {
        const result = bookingLogic.calculateBookingPrice(10, 'standard', false);
        expect(result).toBe(900); // 1000$ - 10%
    });

    // Тест 5: Граничні значення (0 ночей)
    test('Має повертати 0, якщо кількість ночей не є додатною', () => {
        expect(bookingLogic.calculateBookingPrice(0, 'standard', false)).toBe(0);
        expect(bookingLogic.calculateBookingPrice(-1, 'standard', false)).toBe(0);
    });

    // Тест 6: ПРАКТИКА З MOCK-ОБ’ЄКТАМИ (Ізоляція)
    // Ми "замокаємо" функцію отримання сезонного коефіцієнта
    test('Має правильно застосовувати сезонний коефіцієнт через Mock', () => {
        // Створюємо шпигуна (Spy) на функцію, яку хочемо ізолювати
        const spy = vi.spyOn(bookingLogic, 'getSeasonMultiplier').mockReturnValue(2);
        
        const result = bookingLogic.calculateBookingPrice(1, 'standard', false);
        
        expect(result).toBe(200); // 100$ * 2 (наш мок-коефіцієнт)
        expect(spy).toHaveBeenCalled(); // Перевіряємо, чи викликався мок
        
        spy.mockRestore(); // Очищуємо мок після тесту
    });

    // Тест 7: Валідація вхідних даних (типи номерів)
    test('Має використовувати базову ціну, якщо тип номера невідомий', () => {
        const result = bookingLogic.calculateBookingPrice(1, 'unknown-type', false);
        expect(result).toBe(100);
    });
});