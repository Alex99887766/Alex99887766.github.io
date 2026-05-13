// Константи
const EXTRA_GUEST_FEE = 30;
const BASE_GUESTS_COUNT = 2;
const BREAKFAST_FEE = 20;
// Коефіцієнти для різних типів номерів
export const ROOM_RATES = {
    standard: 100,
    deluxe: 150,
    suite: 300
};

export function getSeasonMultiplier() {
    return 1.0;
}

//Розрахунок вартості проживання
export function calculateBookingPrice(nights, roomType, guests, options = {}) {
    if (nights <= 0 || guests <= 0) return 0;

    let pricePerNight = ROOM_RATES[roomType] || ROOM_RATES.standard;
    
    // Доплата за гостей
    if (guests > BASE_GUESTS_COUNT) {
        pricePerNight += (guests - BASE_GUESTS_COUNT) * EXTRA_GUEST_FEE;
    }
    
     if (options.hasBreakfast) pricePerNight += BREAKFAST_FEE;
     

    const multiplier = getSeasonMultiplier(); 
    
    let total = nights * pricePerNight * multiplier;

    // Знижка за тривале перебування (7+ ночей)
    if (nights >= 7) total *= 0.9;

    // Промокод
    if (options.promoCode === 'INTER10') {
        total *= 0.9;
    }

    return Math.round(total);
}

// Розрахунок кількості ночей
export function calculateNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    const nights = diff / (1000 * 60 * 60 * 24);
    return nights > 0 ? nights : 0;
}