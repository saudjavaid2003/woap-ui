import Image from 'next/image';
import { Button } from '@/components/ui/button';


import { Suspense } from 'react';
import ProductList from './components/product-list';

export default async function Home() {

    return (
        <>
            {/* HERO SECTION */}
            <section className="bg-white">
                <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between py-24">
                    <div>
                        <h1 className="text-7xl font-black font-sans leading-tight">
                            Super Delicious Pizza in <br />
                            <span className="text-primary block mt-4">
                                Only 45 Minutes!
                            </span>
                        </h1>

                        <p className="text-2xl mt-8 max-w-lg leading-snug">
                            Enjoy a Free Meal if Your Order Takes More Than 45 Minutes!
                        </p>

                        <Button className="mt-8 text-lg rounded-full py-7 px-6 font-bold">
                            Get your pizza now
                        </Button>
                    </div>

                    <div>
                        <Image
                            alt="pizza-main"
                            src="/pizza-main.png"
                            width={400}
                            height={400}
                        />
                    </div>
                </div>
            </section>
{/* todo: add skeleton component */}
            <Suspense fallback={'Loading....'}>
                <ProductList />
            </Suspense>        </>
    );
}