"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { authClient } from "../../lib/auth-client";
import { formatPrice } from "../../lib/utils";

interface ProductProps {
  id: string;
  name: string;
  images: string[];
  price: number;
  stock: number;
  rating?: number;
  reviewsCount?: number;
  categoryName?: string;
}

export const ProductCard = ({
  id,
  name,
  images,
  price,
  stock,
  rating,
  reviewsCount,
  categoryName,
}: ProductProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      router.push("/login");
      return;
    }
    if (stock > 0) {
      addItem({ id, name, price: Number(price), imageUrl: images[0] || "" });
    }
  };

  const formattedPriceParts = formatPrice(price).split(".");
  const wholePartStr = formattedPriceParts[0].replace("₹", "");
  const decimalPartStr = formattedPriceParts[1] || "00";
  const originalPrice = price * 1.3;
  const discountPct = Math.round((1 - price / originalPrice) * 100);

  return (
    <div className="flex flex-col bg-white overflow-hidden group p-4 hover:z-10 relative">
      <Link href={`/product/${id}`} className="flex-1 flex flex-col">
        {/* Product Image */}
        <div className="relative h-52 w-full mb-3 overflow-hidden flex items-center justify-center bg-white">
          <img
            src={images[0] || "https://placehold.co/400"}
            alt={name}
            loading="lazy"
            decoding="async"
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
                  className={`h-[14px] w-[14px] ${i < Math.floor(rating || 0) ? "fill-current" : ""}`}
                />
              ))}
            </div>
            <span className="text-[#007185] hover:text-[#c45500] text-xs cursor-pointer">
              {(reviewsCount || 0).toLocaleString()}
            </span>
          </div>

          {/* Price */}
          <div className="mt-1">
            <div className="flex items-center gap-2">
              <div className="flex items-start">
                <span className="text-xs font-medium leading-none mt-[2px]">₹</span>
                <span className="text-[22px] font-medium leading-none tracking-tight">
                  {wholePartStr}
                </span>
                <span className="text-xs font-medium leading-none mt-[2px]">
                  {decimalPartStr}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-gray-500 line-through">{formatPrice(originalPrice)}</span>
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

    </div>
  );
};
