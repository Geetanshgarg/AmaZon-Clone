"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";

interface ProductProps {
  id: string;
  name: string;
  imageUrl: string | null;
  price: number;
  stock: number;
  rating?: number;
  reviewsCount?: number;
  categoryName?: string;
}

export const ProductCard = ({
  id,
  name,
  imageUrl,
  price,
  stock,
  rating = 4.2 + Math.random() * 0.8,
  reviewsCount = Math.floor(100 + Math.random() * 2000),
  categoryName,
}: ProductProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 0) {
      addItem({ id, name, price: Number(price), imageUrl: imageUrl || "" });
    }
  };

  const wholePart = Math.floor(price);
  const decimalPart = (price % 1).toFixed(2).substring(2);
  const originalPrice = price * 1.3;
  const discountPct = Math.round((1 - price / originalPrice) * 100);

  return (
    <div className="flex flex-col bg-white overflow-hidden group p-4 hover:z-10 relative">
      <Link href={`/product/${id}`} className="flex-1 flex flex-col">
        {/* Product Image */}
        <div className="relative h-52 w-full mb-3 overflow-hidden flex items-center justify-center bg-white">
          <img
            src={imageUrl || "https://placehold.co/400"}
            alt={name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-1 flex-1">
          {/* Title */}
          <h3 className="text-sm text-[#0f1111] group-hover:text-[#c45500] line-clamp-2 leading-snug font-medium">
            {name}
          </h3>

          {/* Category pill */}
          {categoryName && (
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">{categoryName}</span>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mt-0.5">
            <div className="flex text-[#de7921]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-[14px] w-[14px] ${i < Math.floor(rating) ? "fill-current" : ""}`}
                />
              ))}
            </div>
            <span className="text-[#007185] hover:text-[#c45500] text-xs cursor-pointer">
              {reviewsCount.toLocaleString()}
            </span>
          </div>

          {/* Price */}
          <div className="mt-1">
            <div className="flex items-center gap-2">
              <div className="flex items-start">
                <span className="text-xs font-medium leading-none mt-[2px]">$</span>
                <span className="text-[22px] font-medium leading-none tracking-tight">
                  {wholePart}
                </span>
                <span className="text-xs font-medium leading-none mt-[2px]">
                  {decimalPart}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
              <span className="text-xs text-[#CC0C39]">({discountPct}% off)</span>
            </div>
          </div>

          {/* Delivery */}
          <div className="mt-1.5">
            <span className="text-xs text-gray-700">FREE delivery </span>
            <span className="text-xs font-bold text-gray-900">Tomorrow</span>
          </div>

          {/* Stock warning */}
          {stock > 0 && stock < 10 && (
            <p className="text-xs text-[#CC0C39] mt-0.5">
              Only {stock} left in stock - order soon.
            </p>
          )}
          {stock === 0 && (
            <p className="text-xs text-gray-500 mt-0.5">Currently unavailable.</p>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={stock === 0}
        className="mt-3 w-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm py-1.5 rounded-full cursor-pointer font-medium shadow-sm transition-colors border border-transparent hover:border-[#f2c200] disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500"
      >
        Add to Cart
      </button>
    </div>
  );
};
