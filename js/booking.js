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

// Об'єкт для експорту логіки
export const bookingLogic = {
    getSeasonMultiplier() {
        return 1.0; 
    },

    calculateBookingPrice(nights, roomType, guests, options = {}) {
        if (nights <= 0 || guests <= 0) return 0;

        let pricePerNight = ROOM_RATES[roomType] || ROOM_RATES.standard;
        
        if (guests > BASE_GUESTS_COUNT) {
            pricePerNight += (guests - BASE_GUESTS_COUNT) * EXTRA_GUEST_FEE;
        }

        if (options.hasBreakfast) pricePerNight += BREAKFAST_FEE;

        const multiplier = this.getSeasonMultiplier(); 
        
        let total = nights * pricePerNight * multiplier;

        if (nights >= 7) total *= 0.9;
        if (options.promoCode === 'INTER10') total *= 0.9;

        return Math.round(total);
    },

    calculateNights(checkIn, checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = end - start;
        return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
    }
};