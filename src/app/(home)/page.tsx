import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from './components/ProductCard';
import { Category, Product } from '@/lib/types';

export default async function Home() {
    // 🔥 Fetch BOTH in parallel (better)
    const [categoryResponse, productsResponse] = await Promise.all([
        fetch(`${process.env.BACKEND_URL}/api/catalog/categories`, {
            next: { revalidate: 3600 },
        }),
        fetch(
            `${process.env.BACKEND_URL}/api/catalog/products?perPage=100&tenantId=10`,
            {
                next: { revalidate: 3600 },
            }
        ),
    ]);

    if (!categoryResponse.ok) {
        throw new Error('Failed to fetch categories');
    }

    if (!productsResponse.ok) {
        throw new Error('Failed to fetch products');
    }

    const categories: Category[] = await categoryResponse.json();
    const products: { data: Product[] } = await productsResponse.json();

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

            {/* PRODUCTS SECTION */}
            <section>
                <div className="container mx-auto px-6 lg:px-12 py-12">
                    <Tabs defaultValue={categories?.[0]?._id}>
                        <TabsList>
                            {categories.map((category) => (
                                <TabsTrigger
                                    key={category._id}
                                    value={category._id}
                                    className="text-md"
                                >
                                    {category.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {categories.map((category) => (
                            <TabsContent key={category._id} value={category._id}>
                                <div className="grid grid-cols-4 gap-6 mt-6">
                                    {products.data
                                        .filter(
                                            (product) =>
                                                product.category._id === category._id
                                        )
                                        .map((product) => (
                                            <ProductCard
                                                product={product}
                                                key={product._id}
                                            />
                                        ))}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>
        </>
    );
}