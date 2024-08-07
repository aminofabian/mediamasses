// You might want to put this in a separate types file, e.g., '@/types/cart.ts'
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  targetUrl: string;
  currency: 'KES' | 'USD';
}