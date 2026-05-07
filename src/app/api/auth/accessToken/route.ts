import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    return Response.json({ token: cookieStore.get('accessToken')?.value });
}
