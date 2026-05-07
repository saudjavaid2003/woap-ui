import { cookies } from 'next/headers';
import cookie from 'cookie';

export async function POST() {
    const cookieStore = await cookies(); // ✅ await

    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/auth/refresh`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${cookieStore.get('accessToken')?.value}`,
            Cookie: `refreshToken=${cookieStore.get('refreshToken')?.value}`,
        },
    });

    if (!response.ok) {
        console.log('Refresh failed.');
        return Response.json({ success: false });
    }

    const c = response.headers.getSetCookie();
    const accessToken = c.find((c) => c.includes('accessToken'));
    const refreshToken = c.find((c) => c.includes('refreshToken'));

    if (!accessToken || !refreshToken) {
        console.log('Tokens could not found.');
        return Response.json({ success: false });
    }

    const parsedAccessToken = cookie.parse(accessToken);
    const parsedRefreshToken = cookie.parse(refreshToken);

    if (!parsedAccessToken.accessToken || !parsedRefreshToken.refreshToken) {
        return Response.json({ success: false });
    }

    cookieStore.set({
        name: 'accessToken',
        value: parsedAccessToken.accessToken,
        expires: parsedAccessToken.Expires ? new Date(parsedAccessToken.Expires) : undefined, // ✅ capital E
        httpOnly: true,
        path: parsedAccessToken.Path ?? '/',
        domain: parsedAccessToken.Domain,
        sameSite: parsedAccessToken.SameSite as 'strict' | 'lax' | 'none' ?? 'lax',
    });

    cookieStore.set({
        name: 'refreshToken',
        value: parsedRefreshToken.refreshToken,
        expires: parsedRefreshToken.Expires ? new Date(parsedRefreshToken.Expires) : undefined, // ✅ capital E
        httpOnly: true,
        path: parsedRefreshToken.Path ?? '/',
        domain: parsedRefreshToken.Domain,
        sameSite: parsedRefreshToken.SameSite as 'strict' | 'lax' | 'none' ?? 'lax',
    });

    return Response.json({ success: true });
}