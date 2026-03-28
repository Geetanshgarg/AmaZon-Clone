"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "../../store/useCartStore";
import { formatPrice } from "../../lib/utils";

export const OrderSummary = () => {
  const { cartCount, cartTotal } = useCartStore();
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
      <div className="flex gap-2">
        <span className="text-sm">Subtotal ({cartCount} item{cartCount === 1 ? "" : "s"}):</span>
        <span className="text-lg font-bold">{formatPrice(cartTotal)}</span>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <input type="checkbox" className="min-w-4 h-4 accent-[#007185]" />
        <label className="text-sm">This order contains a gift</label>
      </div>

      <button 
        onClick={() => router.push("/checkout")}
        className="w-full mt-4 bg-[#ffd814] hover:bg-[#f7ca00] transition-colors py-1.5 rounded-full text-sm font-medium border border-transparent hover:border-[#f2c200] shadow-sm cursor-pointer"
      >
        Proceed to checkout
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-bold">Frequently bought with these items</h4>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-12 h-12 bg-gray-100 shrink-0" />
          <div className="text-xs text-[#007185] hover:underline cursor-pointer">
            Recommended Item 1
          </div>
        </div>
      </div>
    </div>
  );
};
