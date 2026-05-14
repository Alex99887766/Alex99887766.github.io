import { test, expect } from '@playwright/test';

test('Повний цикл бронювання: від вибору дати до повідомлення', async ({ page }) => {
    // 1. Відкриваємо сторінку
    await page.goto('/', { waitUntil: 'networkidle' });

    // 2. Натискаємо кнопку, щоб відкрити модалку
    await page.locator('.btn-book').first().click();

    // 3. Чекаємо, поки модалка стане видимою
    await page.waitForSelector('#booking-modal.active', { state: 'visible' });

    // 4. Заповнюємо форму (використовуємо твої реальні ID)
    await page.selectOption('#room-type', 'deluxe');
    await page.fill('#check-in', '2026-06-10');
    await page.fill('#check-out', '2026-06-15');
    await page.fill('#guests', '3');
    
    // ОСЬ ТУТ БУЛА ПОМИЛКА: використовуємо #name
    await page.fill('#name', 'Олексій Гнатецький'); 
    await page.fill('#email', 'alex.test@example.com');
    
    await page.check('#breakfast'); // Додаємо сніданок
    await page.fill('#promo-code', 'INTER10');

    // 5. Налаштовуємо перехоплення Alert (має бути ДО кліку submit)
    page.on('dialog', async dialog => {
        console.log(`Alert message: ${dialog.message()}`);
        expect(dialog.message()).toContain('Дякуємо'); 
        await dialog.accept(); // Натискаємо "ОК" в браузері
    });

    // 6. Відправляємо форму
    // Використовуємо dispatchEvent, щоб уникнути проблем зі скролом у Codespaces
    await page.locator('#booking-form button[type="submit"]').dispatchEvent('click');

    // 7. Опціонально: чекаємо трохи, щоб відео встигло записати результат
    await page.waitForTimeout(1000);
});