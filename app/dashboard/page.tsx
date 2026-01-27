'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/types';

export default function Dashboard() {
  const router = useRouter();
  const userId = useUserStore((state) => state.userId);

  useEffect(() => {
    if (userId === null) {
      router.replace('/');
    }
  }, [userId, router]);

  if (userId === null) return null;

  const products = useQuery(api.products.get);

  if (!products) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando productos...</p>
      </div>
    );
  }


  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
        {products.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
