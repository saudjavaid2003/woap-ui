'use client';
import { setInitialCartItems } from '@/lib/store/features/cart/cartSlice';
import { AppStore, makeStore } from '../lib/store';
import { useState } from 'react';
import { Provider } from 'react-redux';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    // Use useState to initialize the store exactly once safely during creation
    const [store] = useState(() => {
        const storeInstance = makeStore();
        
        // Handle localStorage safely inside the initialization function
        const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
        if (isLocalStorageAvailable) {
            const cartItems = window.localStorage.getItem('cartItems');
            if (cartItems) {
                try {
                    const parsedItems = JSON.parse(cartItems);
                    storeInstance.dispatch(setInitialCartItems(parsedItems));
                } catch (err) {
                    console.error('Failed to parse cart items from localStorage:', err);
                }
            }
        }
        
        return storeInstance;
    });

    return <Provider store={store}>{children}</Provider>;
}