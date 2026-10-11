'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CartItem, CartState, Product, ProductVariant } from '@/types';

// ─── Actions ──────────────────────────────────────────────────────────────────
type CartAction =
  | { type: 'ADD_ITEM';    payload: { product: Product; variant: ProductVariant } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId: string } }
  | { type: 'UPDATE_QTY';  payload: { productId: string; variantId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE';     payload: CartItem[] };

// ─── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE': {
      const items = action.payload;
      return buildState(items);
    }
    case 'ADD_ITEM': {
      const { product, variant } = action.payload;
      const existing = state.items.find(
        i => i.productId === product.id && i.variantId === variant.id
      );
      let items: CartItem[];
      if (existing) {
        items = state.items.map(i =>
          i.productId === product.id && i.variantId === variant.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        items = [...state.items, {
          productId:  product.id,
          variantId:  variant.id,
          name:       product.name,
          packSize:   variant.packSize,
          price:      variant.price,
          quantity:   1,
          image:      product.image,
          slug:       product.slug,
          stock:      variant.stock,
        }];
      }
      return buildState(items);
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(
        i => !(i.productId === action.payload.productId && i.variantId === action.payload.variantId)
      );
      return buildState(items);
    }
    case 'UPDATE_QTY': {
      const items = action.payload.quantity <= 0
        ? state.items.filter(i => !(i.productId === action.payload.productId && i.variantId === action.payload.variantId))
        : state.items.map(i =>
            i.productId === action.payload.productId && i.variantId === action.payload.variantId
              ? { ...i, quantity: action.payload.quantity }
              : i
          );
      return buildState(items);
    }
    case 'CLEAR_CART':
      return buildState([]);
    default:
      return state;
  }
}

function buildState(items: CartItem[]): CartState {
  return {
    items,
    totalItems: items.reduce((acc, i) => acc + i.quantity, 0),
    subtotal:   items.reduce((acc, i) => acc + i.price * i.quantity, 0),
  };
}

const initialState: CartState = { items: [], totalItems: 0, subtotal: 0 };

// ─── Context ──────────────────────────────────────────────────────────────────
interface CartContextValue extends CartState {
  addItem:    (product: Product, variant: ProductVariant) => void;
  removeItem: (productId: string, variantId: string)      => void;
  updateQty:  (productId: string, variantId: string, quantity: number) => void;
  clearCart:  () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('agrovet_cart');
      if (stored) dispatch({ type: 'HYDRATE', payload: JSON.parse(stored) });
    } catch { /* ignore */ }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agrovet_cart', JSON.stringify(state.items));
    } catch { /* ignore */ }
  }, [state.items]);

  const addItem    = (product: Product, variant: ProductVariant) => dispatch({ type: 'ADD_ITEM',    payload: { product, variant } });
  const removeItem = (productId: string, variantId: string)       => dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } });
  const updateQty  = (productId: string, variantId: string, quantity: number) => dispatch({ type: 'UPDATE_QTY', payload: { productId, variantId, quantity } });
  const clearCart  = ()                                            => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
