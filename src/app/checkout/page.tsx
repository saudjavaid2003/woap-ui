
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import CustomerForm from './components/customerForm';

export default async function Checkout({
    searchParams,
}: {
    searchParams: Promise<{ restaurantId: string }>;
}) {
    const session = await getSession();
    const resolvedParams = await searchParams;

      const sParams = new URLSearchParams(resolvedParams);
    const existingQueryString = sParams.toString();

    sParams.append('return-to', `/checkout?${existingQueryString}`);

    // /login?return-to=/checkout?existingQueryString

    if (!session) {
        redirect(`/login?${sParams}`);
    }

    return (
    <CustomerForm />
    );
}