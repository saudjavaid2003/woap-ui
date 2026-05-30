'use client';
import React, { useEffect, useState, Suspense } from 'react';
import ToppingCard from './topping-card';
import { Topping } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

const ToppingListInner = ({
    selectedToppings,
    handleCheckBoxCheck,
}: {
    selectedToppings: Topping[];
    handleCheckBoxCheck: (topping: Topping) => void;
}) => {
    const searchParams = useSearchParams();
    const [toppings, setToppings] = useState<Topping[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const restaurantId = searchParams.get('restaurantId');
            if (!restaurantId) return;
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalog/toppings?tenantId=${restaurantId}`;
            const toppingResponse = await fetch(url);
            const data = await toppingResponse.json();
            const normalized = data.map((t: any) => ({ ...t, id: t._id ?? t.id }));
            setToppings(normalized);
        };
        fetchData();
    }, [searchParams]);

    return (
        <section className="mt-6">
            <h3>Extra toppings</h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
                {toppings.length === 0 && (
                    <p className="text-sm text-muted-foreground col-span-3">No toppings found</p>
                )}
                {toppings.map((topping) => (
                    <ToppingCard
                        topping={topping}
                        key={topping.id}
                        selectedToppings={selectedToppings}
                        handleCheckBoxCheck={handleCheckBoxCheck}
                    />
                ))}
            </div>
        </section>
    );
};

const ToppingList = (props: {
    selectedToppings: Topping[];
    handleCheckBoxCheck: (topping: Topping) => void;
}) => (
    <Suspense fallback={<div>Loading toppings...</div>}>
        <ToppingListInner {...props} />
    </Suspense>
);

export default ToppingList;