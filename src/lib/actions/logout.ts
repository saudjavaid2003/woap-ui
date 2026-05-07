'use server';

import { cookies } from 'next/headers';

export const logout = async () => {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/auth/logout`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
            cookie: `refreshToken=${cookieStore.get('refreshToken')?.value}`,
        },
    });

    if (!response.ok) {
        console.log('Logout failed', response.status);
        return false;
    }

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    return true;
};