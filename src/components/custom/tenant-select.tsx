'use client';
import React, { Suspense } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tenant } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';

const TenantSelectInner = ({ restaurants }: { restaurants: { data: Tenant[] } }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleValueChange = (value: string) => {
        router.push(`/?restaurantId=${value}`);
    };

    return (
        <Select onValueChange={handleValueChange} defaultValue={searchParams.get('restaurantId') || ''}>
            <SelectTrigger className="w-[180px] focus:ring-0">
                <SelectValue placeholder="Select Restaurant" />
            </SelectTrigger>
            <SelectContent>
                {restaurants.data.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={String(restaurant.id)}>
                        {restaurant.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

const TenantSelect = (props: { restaurants: { data: Tenant[] } }) => (
    <Suspense fallback={null}>
        <TenantSelectInner {...props} />
    </Suspense>
);

export default TenantSelect;