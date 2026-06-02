'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  format: string;
  price: number;
  qty: number;
  color: string;
  fruits?: string[];
};

type State = { items: CartItem[]; open: boolean };

type Action =
  | { type: 'ADD'; item: Omit<CartItem, 'qty'> }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_QTY'; id: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const idx = state.items.findIndex(i => i.id === action.item.id);
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = { ...items[idx], qty: items[idx].qty + 1 };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'SET_QTY': {
      if (action.qty <= 0) return { ...state, items: state.items.filter(i => i.id !== action.id) };
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i) };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, open: true };
    case 'CLOSE':
      return { ...state, open: false };
    default:
      return state;
  }
}

type CartContextType = {
  items: CartItem[];
  open: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'soltana-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    { items: [], open: false },
    (init): State => {
      if (typeof window === 'undefined') return init;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? { ...init, items: JSON.parse(raw) as CartItem[] } : init;
      } catch {
        return init;
      }
    }
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      open: state.open,
      totalItems,
      totalPrice,
      addItem:    (item)      => dispatch({ type: 'ADD',     item     }),
      removeItem: (id)        => dispatch({ type: 'REMOVE',  id       }),
      setQty:     (id, qty)   => dispatch({ type: 'SET_QTY', id, qty  }),
      clearCart:  ()          => dispatch({ type: 'CLEAR'             }),
      openCart:   ()          => dispatch({ type: 'OPEN'              }),
      closeCart:  ()          => dispatch({ type: 'CLOSE'             }),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
