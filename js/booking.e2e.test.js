import { test, expect } from '@playwright/test';

test('Повний цикл бронювання: від вибору дати до повідомлення', async ({ page }) => {
    // 1. Відкриваємо сайт (використовуй посилання з вкладки Ports)
    await page.goto('http://localhost:5173'); 

    // 2. Натискаємо на кнопку, щоб відкрити модалку
    await page.click('.btn-book'); 

    // 3. Заповнюємо форму
    await page.fill('#check-in', '2026-06-10');
    await page.fill('#check-out', '2026-06-15');
    
    // 4. Перехоплюємо alert, який з'являється після сабміту
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Дякуємо'); 
        await dialog.accept();
    });

    // 5. Відправляємо форму
    await page.click('#booking-form button[type="submit"]');
});