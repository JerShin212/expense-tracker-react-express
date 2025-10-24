import api from "../services/api";

// Currency data with symbols
const currencyData = {
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' },
    JPY: { symbol: '¥', name: 'Japanese Yen' },
    CNY: { symbol: '¥', name: 'Chinese Yuan' },
    MYR: { symbol: 'RM', name: 'Malaysian Ringgit' },
    SGD: { symbol: 'S$', name: 'Singapore Dollar' },
    THB: { symbol: '฿', name: 'Thai Baht' },
    IDR: { symbol: 'Rp', name: 'Indonesian Rupiah' },
    PHP: { symbol: '₱', name: 'Philippine Peso' },
    INR: { symbol: '₹', name: 'Indian Rupee' },
    AUD: { symbol: 'A$', name: 'Australian Dollar' },
    CAD: { symbol: 'C$', name: 'Canadian Dollar' },
    CHF: { symbol: 'CHF', name: 'Swiss Franc' },
    KRW: { symbol: '₩', name: 'South Korean Won' },
    HKD: { symbol: 'HK$', name: 'Hong Kong Dollar' },
    NZD: { symbol: 'NZ$', name: 'New Zealand Dollar' },
    SEK: { symbol: 'kr', name: 'Swedish Krona' },
    NOK: { symbol: 'kr', name: 'Norwegian Krone' },
    DKK: { symbol: 'kr', name: 'Danish Krone' },
    ZAR: { symbol: 'R', name: 'South African Rand' },
    BRL: { symbol: 'R$', name: 'Brazilian Real' },
    MXN: { symbol: 'Mex$', name: 'Mexican Peso' },
    AED: { symbol: 'د.إ', name: 'UAE Dirham' },
    SAR: { symbol: 'SR', name: 'Saudi Riyal' }
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode = 'USD') => {
    return currencyData[currencyCode]?.symbol || '$';
};

// Format amount with currency
export const formatCurrency = (amount, currencyCode = 'USD') => {
    const symbol = getCurrencySymbol(currencyCode);
    const formattedAmount = parseFloat(amount).toFixed(2);

    // Add thousands separator
    const parts = formattedAmount.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return `${symbol}${parts.join('.')}`;
};

// Get user's currency from localStorage (falling back to settings API once)
export const getUserCurrency = async () => {
    try {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (user?.currency) {
            return user.currency;
        }

        const response = await api.get('/settings');
        const currency = response.data?.data?.currency || 'USD';
        const updatedUser = { ...(user || {}), currency };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return currency;
    } catch {
        return 'USD';
    }
};
