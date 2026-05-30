'use client';
import { useAppSelector } from '@/lib/store/hooks';
import { ShoppingBasket } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

const CartCounterInner = () => {
    const searchParams = useSearchParams();
    const cartItems = useAppSelector((state) => state.cart.cartItems);

    return (
        <div className="relative">
            <Link href={`/cart?restaurantId=${searchParams.get('restaurantId')}`}>
                <ShoppingBasket className="hover:text-primary" />
            </Link>
            <span className="absolute -top-4 -right-5 h-6 w-6 flex items-center justify-center rounded-full bg-primary font-bold text-white">
                {cartItems.length}
            </span>
        </div>
    );
};

const CartCounter = () => (
    <Suspense fallback={null}>
        <CartCounterInner />
    </Suspense>
);

export default CartCounter;