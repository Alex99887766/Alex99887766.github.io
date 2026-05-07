const { test, expect } = require('@playwright/test');

test('Користувач може успішно забронювати номер', async ({ page }) => {
    // 1. Зайти на сайт
    await page.goto('https://alex99887766.github.io/contact.html'); // Або інша адреса твого дев-сервера

    // 2. Відкрити вікно бронювання
    await page.click('.btn-book[data-room="deluxe"]');

    // 3. Заповнити дати
    await page.fill('#check-in', '2026-06-01');
    await page.fill('#check-out', '2026-06-05');

    // 4. Натиснути "Забронювати"
    // Очікування alert
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Дякуємо');
        await dialog.accept();
    });

    await page.click('#booking-form button[type="submit"]');
});