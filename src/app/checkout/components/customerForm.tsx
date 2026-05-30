'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Coins, CreditCard } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { createOrder, getCustomer } from '@/lib/http/api';
import { Customer, OrderData } from '@/lib/types';
import AddAdress from './addAddress';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import OrderSummary from './orderSummary';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { useSearchParams } from 'next/navigation';
import { clearCart } from '@/lib/store/features/cart/cartSlice';

const formSchema = z.object({
    address: z.string({ error: 'Please select an address.' }),
    paymentMode: z.enum(['card', 'cash'] as const , {
        error : 'You need to select a payment mode type.',
    }),
    comment: z.any(),
});

const CustomerForm = () => {
    const dispatch = useAppDispatch();

    const customerForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const searchParam = useSearchParams();

    // FIX: Replaced React.useRef with standard state to eliminate the React 19 compiler build error
    const [couponCode, setCouponCode] = useState('');
    
    // Stable checkout session idempotency key
    const [idempotencyKey] = useState(() => uuidv4());

    const cart = useAppSelector((state) => state.cart);

    const { data: customer, isLoading } = useQuery<Customer>({
        queryKey: ['customer'],
        queryFn: async () => {
            return await getCustomer().then((res) => res.data);
        },
    });

    const { mutate, isPending: isPlaceOrderPending } = useMutation({
        mutationKey: ['order'],
        mutationFn: async (data: OrderData) => {
            const uniqueKey = customer?._id ? `${idempotencyKey}-${customer._id}` : idempotencyKey;
            return await createOrder(data, uniqueKey).then((res) => res.data);
        },
        retry: 3,
        onSuccess: (data: { paymentUrl: string | null }) => {
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            }

            alert('Order placed successfully!');
            dispatch(clearCart());
        },
    });

    if (isLoading) {
        return <h3>Loading...</h3>;
    }

    const handlePlaceOrder = (data: z.infer<typeof formSchema>) => {
        const tenantId = searchParam.get('restaurantId');
        if (!tenantId) {
            alert('Restaurant Id is required!');
            return;
        }
        const orderData: OrderData = {
            cart: cart.cartItems,
            couponCode: couponCode, // Safely reading from state inside the event handler
            tenantId: tenantId,
            customerId: customer ? customer._id : '',
            comment: data.comment,
            address: data.address,
            paymentMode: data.paymentMode,
        };

        mutate(orderData);
    };

    return (
        <Form {...customerForm}>
            <form onSubmit={customerForm.handleSubmit(handlePlaceOrder)}>
                <div className="flex container gap-6 mt-16">
                    <Card className="w-3/5 border-none">
                        <CardHeader>
                            <CardTitle>Customer details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="fname">First Name</Label>
                                    <Input
                                        id="fname"
                                        type="text"
                                        className="w-full"
                                        defaultValue={customer?.firstName}
                                        disabled
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="lname">Last Name</Label>
                                    <Input
                                        id="lname"
                                        type="text"
                                        className="w-full"
                                        defaultValue={customer?.lastName}
                                        disabled
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="text"
                                        className="w-full"
                                        defaultValue={customer?.email}
                                        disabled
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="name">Address</Label>
                                            <AddAdress customerId={customer?._id} />
                                        </div>

                                        <FormField
                                            name="address"
                                            control={customerForm.control}
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={field.onChange}
                                                                className="grid grid-cols-2 gap-6 mt-2">
                                                                {customer?.addresses.map(
                                                                    (address) => {
                                                                        return (
                                                                            <Card
                                                                                className="p-6"
                                                                                key={address.text}>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <FormControl>
                                                                                        <RadioGroupItem
                                                                                            value={
                                                                                                address.text
                                                                                            }
                                                                                            id={
                                                                                                address.text
                                                                                            }
                                                                                        />
                                                                                    </FormControl>
                                                                                    <Label
                                                                                        htmlFor={
                                                                                            address.text
                                                                                        }
                                                                                        className="leading-normal">
                                                                                        {
                                                                                            address.text
                                                                                        }
                                                                                    </Label>
                                                                                </div>
                                                                            </Card>
                                                                        );
                                                                    }
                                                                )}
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Label>Payment Mode</Label>
                                    <FormField
                                        name="paymentMode"
                                        control={customerForm.control}
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            className="flex gap-6">
                                                            <div className="w-36">
                                                                <FormControl>
                                                                    <RadioGroupItem
                                                                        value={'card'}
                                                                        id={'card'}
                                                                        className="peer sr-only"
                                                                        aria-label={'card'}
                                                                    />
                                                                </FormControl>
                                                                <Label
                                                                    htmlFor={'card'}
                                                                    className="flex items-center justify-center rounded-md border-2 bg-white p-2 h-16 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                                    <CreditCard size={'20'} />
                                                                    <span className="ml-2">
                                                                        Card
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                            <div className="w-36">
                                                                <FormControl>
                                                                    <RadioGroupItem
                                                                        value={'cash'}
                                                                        id={'cash'}
                                                                        className="peer sr-only"
                                                                        aria-label={'cash'}
                                                                    />
                                                                </FormControl>
                                                                <Label
                                                                    htmlFor={'cash'}
                                                                    className="flex items-center justify-center rounded-md border-2 bg-white p-2 h-16 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                                    <Coins size={'20'} />
                                                                    <span className="ml-2 text-md">
                                                                        Cash
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="fname">Comment</Label>
                                    <FormField
                                        name="comment"
                                        control={customerForm.control}
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <OrderSummary
                        isPlaceOrderPending={isPlaceOrderPending}
                        handleCouponCodeChange={(code) => {
                            setCouponCode(code); // Updates cleanly via state
                        }}
                    />
                </div>
            </form>
        </Form>
    );
};

export default CustomerForm;