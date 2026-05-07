'use server';
import cookie from 'cookie';
import { cookies } from 'next/headers';

export default async function register(prevState: any, formdata: FormData) {
    const firstName = formdata.get('firstName');
    const lastName = formdata.get('lastName');
    const email = formdata.get('email');
    const password = formdata.get('password');
    // todo: do request data validation

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/auth/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.log('error', error);
            return {
                type: 'error',
                message: error.errors[0].msg,
            };
        }

        const c = response.headers.getSetCookie();
        const accessTokenCookie = c.find((cookie) => cookie.includes('accessToken'));
        const refreshTokenCookie = c.find((cookie) => cookie.includes('refreshToken'));

        if (!accessTokenCookie || !refreshTokenCookie) {
            return {
                type: 'error',
                message: 'No cookies were found!',
            };
        }

        const parsedAccessToken = cookie.parse(accessTokenCookie);
        const parsedRefreshToken = cookie.parse(refreshTokenCookie);

        if (!parsedAccessToken.accessToken || !parsedRefreshToken.refreshToken) {
            return {
                type: 'error',
                message: 'Failed to parse tokens from cookies!',
            };
        }

        const cookieStore = await cookies();

        cookieStore.set({
            name: 'accessToken',
            value: parsedAccessToken.accessToken,
            expires: parsedAccessToken.Expires
                ? new Date(parsedAccessToken.Expires)
                : undefined,
            httpOnly: true,
            path: parsedAccessToken.Path ?? '/',
            domain: parsedAccessToken.Domain,
            sameSite: (parsedAccessToken.SameSite as 'strict' | 'lax' | 'none') ?? 'lax',
        });

        cookieStore.set({
            name: 'refreshToken',
            value: parsedRefreshToken.refreshToken,
            expires: parsedRefreshToken.Expires
                ? new Date(parsedRefreshToken.Expires)
                : undefined,
            httpOnly: true,
            path: parsedRefreshToken.Path ?? '/',
            domain: parsedRefreshToken.Domain,
            sameSite: (parsedRefreshToken.SameSite as 'strict' | 'lax' | 'none') ?? 'lax',
        });

        return {
            type: 'success',
            message: 'Registration successful!',
        };
    } catch (err: any) {
        return {
            type: 'error',
            message: err.message,
        };
    }
}