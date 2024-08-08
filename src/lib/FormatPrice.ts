export const formatPrice = (price: number, currency: 'KES' | 'USD') => {
  return currency === 'KES' 
    ? `KES ${price.toFixed(2)}` 
    //@ts-ignore
    : `$${(price / USD_TO_KES_RATE).toFixed(2)}`;
};

