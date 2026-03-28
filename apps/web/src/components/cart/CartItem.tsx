"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, type CartItem as ICartItem } from "../../store/useCartStore";

interface CartItemProps {
  item: ICartItem;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-200 bg-white">
      {/* Image */}
      <div className="shrink-0">
        <Link href={`/product/${item.id}`}>
          <img
            src={item.imageUrl || "https://placehold.co/400"}
            alt={item.name}
            className="w-32 h-32 object-contain bg-white mix-blend-multiply"
          />
        </Link>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col sm:flex-row gap-4">
        <div className="flex flex-col flex-1 pl-2">
          <Link href={`/product/${item.id}`}>
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#c45500] hover:underline line-clamp-2 leading-tight pr-4">
              {item.name}
            </h3>
          </Link>
          <span className="text-sm text-green-700 font-bold mt-1">In Stock</span>
          <span className="text-xs text-gray-500 mt-0.5">Eligible for FREE Shipping & FREE Returns</span>
          
          <div className="flex items-center gap-1 mt-1 text-sm">
            <input type="checkbox" className="min-w-4 h-4 accent-[#007185]" />
            <label className="text-gray-800 ml-1">This is a gift <span className="text-[#007185] hover:underline hover:text-[#c45500] cursor-pointer">Learn more</span></label>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center bg-gray-100 rounded-md border border-gray-300 shadow-sm overflow-hidden h-8">
              <select
                className="bg-transparent text-sm w-16 h-full px-2 outline-none cursor-pointer hover:bg-gray-200"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i}>
                    {i === 0 ? "0 (Delete)" : i}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-4 border-l border-gray-300" />
            <button
              onClick={() => removeItem(item.id)}
              className="text-sm text-[#007185] hover:underline hover:text-[#c45500]"
            >
              Delete
            </button>
            <div className="h-4 border-l border-gray-300" />
            <button className="text-sm text-[#007185] hover:underline hover:text-[#c45500]">
              Save for later
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex flex-col items-end sm:items-start sm:min-w-[100px] font-bold text-lg pt-1">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
    </div>
  );
};
