import { bookingLogic } from '../js/booking.js'; 
import { expect, test, describe, vi } from 'vitest';

describe('Unit-тести бізнес-логіки InterContinental', () => {

    // Тест 1: Базовий розрахунок
    test('Має правильно рахувати стандартний номер для 2 гостей', () => {
        const result = bookingLogic.calculateBookingPrice(3, 'standard', 2, { hasBreakfast: false });
        expect(result).toBe(300); // 3 ночі * 100$
    });

    // Тест 2: Доплата за додаткових гостей
    test('Має додавати 30$ за кожного гостя понад двох', () => {
        const result = bookingLogic.calculateBookingPrice(1, 'standard', 4, { hasBreakfast: false });
        expect(result).toBe(160); // 100$ + (2 додаткові гості * 30$)
    });

    // Тест 3: Перевірка промокоду
    test('Має застосовувати знижку 10% за промокодом INTER10', () => {
        const result = bookingLogic.calculateBookingPrice(1, 'deluxe', 2, { promoCode: 'INTER10' });
        expect(result).toBe(135); // 150$ - 10%
    });

    // Тест 4: Валідація некоректних даних
    test('Має повертати 0 при нульовій кількості ночей або гостей', () => {
        expect(bookingLogic.calculateBookingPrice(0, 'standard', 2)).toBe(0);
        expect(bookingLogic.calculateBookingPrice(3, 'standard', 0)).toBe(0);
    });

    // Тест 5: Mock об'єкт
    test('Має подвоювати ціну, якщо сезонний коефіцієнт = 2.0 (Mock)', () => {
        // Створюємо Mock (шпигуна), який підміняє реальну функцію коефіцієнта
        const seasonSpy = vi.spyOn(bookingLogic, 'getSeasonMultiplier').mockReturnValue(2.0);
        
        const result = bookingLogic.calculateBookingPrice(1, 'standard', 2);
        
        expect(result).toBe(200); // 100$ * 2.0
        expect(seasonSpy).toHaveBeenCalled(); // Перевірка, що Mock був викликаний
        
        seasonSpy.mockRestore(); // Відновлюємо оригінальну функцію
    });

    // Тест 6: Покриття розрахунку ночей
    test('Має правильно розраховувати різницю між датами', () => {
        expect(bookingLogic.calculateNights('2026-05-10', '2026-05-15')).toBe(5);
    });
});