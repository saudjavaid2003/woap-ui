'use client';
import React, { useEffect, useState } from 'react';
import ToppingCard from './topping-card';
import { Topping } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

const ToppingList = ({
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

            console.log('[ToppingList] restaurantId from searchParams:', restaurantId);

            if (!restaurantId) {
                console.warn('[ToppingList] No restaurantId found in URL — skipping fetch');
                return;
            }

            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalog/toppings?tenantId=${restaurantId}`;
            console.log('[ToppingList] Fetching toppings from URL:', url);

            const toppingResponse = await fetch(url);
            console.log('[ToppingList] Response status:', toppingResponse.status);

            const data = await toppingResponse.json();
            console.log('[ToppingList] Raw response data:', data);
            console.log('[ToppingList] First item keys (if any):', data?.[0] ? Object.keys(data[0]) : 'empty array');

            // Normalize _id -> id because MongoDB returns _id but Topping type uses id
            const normalized = data.map((t: any) => {
                console.log(`[ToppingList] Normalizing topping: _id=${t._id}, id=${t.id}, name=${t.name}`);
                return { ...t, id: t._id ?? t.id };
            });

            console.log('[ToppingList] Normalized toppings:', normalized);
            setToppings(normalized);
        };

        fetchData();
    }, [searchParams]);

    console.log('[ToppingList] Rendering with toppings count:', toppings.length);

    return (
        <section className="mt-6">
            <h3>Extra toppings</h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
                {toppings.length === 0 && (
                    <p className="text-sm text-muted-foreground col-span-3">No toppings found</p>
                )}
                {toppings.map((topping) => {
                    console.log('[ToppingList] Rendering ToppingCard for:', topping.name, '| id:', topping.id);
                    return (
                        <ToppingCard
                            topping={topping}
                            key={topping.id}
                            selectedToppings={selectedToppings}
                            handleCheckBoxCheck={handleCheckBoxCheck}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default ToppingList;