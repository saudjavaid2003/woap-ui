"use client";

import dynamic from 'next/dynamic';

const CartCounterWithoutSSR = dynamic(() => import('./cart-counter'), { ssr: false });

export default function CartCounterWrapper() {
    return <CartCounterWithoutSSR />;
}