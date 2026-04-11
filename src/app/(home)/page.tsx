import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function Home() {
    return (
        <>
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
                            src={'/pizza-main.png'}
                            width={400}
                            height={400}
                        />
                    </div>
                </div>
            </section>
            
            <section className='ml-40'>
                <div className="container py-12">
                    <Tabs defaultValue="pizza" className="w-100" >
                        <TabsList>
                            <TabsTrigger value="pizza" className="text-md">
                                Pizza
                            </TabsTrigger>
                            <TabsTrigger value="beverages" className="text-md">
                                Beverages
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="pizza">Pizza list</TabsContent>
                        <TabsContent value="beverages">Beverages list </TabsContent>
                    </Tabs>
                </div>
            </section>
        </>
    );
}