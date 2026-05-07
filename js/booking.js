/**
 * Розрахунок вартості проживання
 * @param {number} nights - Кількість ночей
 * @param {string} roomType - Тип номера
 * @param {boolean} hasBreakfast - Чи включений сніданок
 * @returns {number} - Загальна сума
 */
export function calculateBookingPrice(nights, roomType, hasBreakfast) {
    if (nights <= 0) return 0;

    let pricePerNight = 100; // Базова ціна для standard
    if (roomType === 'deluxe') pricePerNight = 150;
    
    if (hasBreakfast) pricePerNight += 20;

    let total = nights * pricePerNight;

    // Знижка за тривале перебування (від 7 ночей)
    if (nights >= 7) {
        total *= 0.9; // 10% знижки
    }

    return Math.round(total);
}

/* Розрахунок кількості ночей між двома датами */
export function calculateNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    const nights = diff / (1000 * 60 * 60 * 24);
    return nights > 0 ? nights : 0;
}