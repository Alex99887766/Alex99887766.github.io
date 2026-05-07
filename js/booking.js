export function getSeasonMultiplier() {
    return 1;
}

export function calculateBookingPrice(nights, roomType, hasBreakfast) {
    if (nights <= 0) return 0;

    let pricePerNight = 100;
    if (roomType === 'deluxe') pricePerNight = 150;
    
    if (hasBreakfast) pricePerNight += 20;

    // Використовуємо залежність, яку можна замокати
    const multiplier = exports.getSeasonMultiplier(); 
    
    let total = nights * pricePerNight * multiplier;

    if (nights >= 7) {
        total *= 0.9;
    }

    return Math.round(total);
}

// Додаткова функція для розрахунку ночей
export function calculateNights(start, end) {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = d2 - d1;
    return Math.max(0, diff / (1000 * 60 * 60 * 24));
}