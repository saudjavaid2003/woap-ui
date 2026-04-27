import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import ProductCard from './ProductCard';
import { Category, Product } from '@/lib/types';

const ProductList = async ({ searchParams }: { searchParams: { restaurantId: string } }) => {
    const restaurantId = searchParams.restaurantId;

    // Safety check: don't fetch if no restaurant is selected yet
    if (!restaurantId) {
        return (
            <div className="container py-12 text-center text-gray-500">
                Please select a restaurant to see the menu.
            </div>
        );
    }

    const categoryResponse = await fetch(`${process.env.BACKEND_URL}/api/catalog/categories`, {
        next: { revalidate: 3600 },
    });

    if (!categoryResponse.ok) throw new Error('Failed to fetch categories');
    const categories: Category[] = await categoryResponse.json();

    const productsResponse = await fetch(
        `${process.env.BACKEND_URL}/api/catalog/products?perPage=100&tenantId=${restaurantId}`,
        { next: { revalidate: 3600 } }
    );

    const products: { data: Product[] } = await productsResponse.json();

    return (
        <section>
            <div className="container py-12">
                <Tabs defaultValue={categories[0]?._id}>
                    <TabsList>
                        {categories.map((category) => (
                            <TabsTrigger key={category._id} value={category._id} className="text-md">
                                {category.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    
                    {categories.map((category) => (
                        <TabsContent key={category._id} value={category._id}>
                            <div className="grid grid-cols-4 gap-6 mt-6">
                                {products.data
                                    .filter((product) => product.category._id === category._id)
                                    .map((product) => (
                                        <ProductCard product={product} key={product._id} />
                                    ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
};

export default ProductList;