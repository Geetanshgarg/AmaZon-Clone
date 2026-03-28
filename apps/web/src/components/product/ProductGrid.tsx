"use client";

import { ProductCard } from "./ProductCard";

// Skeleton Loader
const ProductSkeleton = () => (
  <div className="flex flex-col bg-white p-4 animate-pulse rounded-sm">
    <div className="h-52 bg-gray-100 mb-4 rounded" />
    <div className="h-3 bg-gray-100 w-3/4 mb-2 rounded" />
    <div className="h-3 bg-gray-100 w-1/2 mb-3 rounded" />
    <div className="h-5 bg-gray-100 w-1/3 mb-2 rounded" />
    <div className="h-3 bg-gray-100 w-2/3 rounded" />
  </div>
);

interface ProductGridProps {
  products: any[];
  loading: boolean;
  error: string | null;
}

export const ProductGrid = ({ products, loading, error }: ProductGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-gray-200 p-[1px]">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <div className="text-red-600 font-medium text-lg mb-2">Something went wrong</div>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4">
        <h3 className="text-xl font-medium text-gray-800 mb-2">No results found</h3>
        <p className="text-gray-500 text-sm text-center max-w-md">
          Try adjusting your search or filter criteria to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1px] bg-gray-200 p-[1px]">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          imageUrl={product.imageUrl}
          price={Number(product.price)}
          stock={product.stock}
          categoryName={product.category?.name}
        />
      ))}
    </div>
  );
};
