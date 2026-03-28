"use client";

import { useCartStore } from "../../store/useCartStore";
import { CartItem } from "../../components/cart/CartItem";
import { OrderSummary } from "../../components/cart/OrderSummary";
import { Navbar } from "../../components/layout/Navbar";
import { formatPrice } from "../../lib/utils";

export default function CartPage() {
  const { items, cartCount } = useCartStore();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-20">
      <Navbar />

      <main className="flex flex-col lg:flex-row w-full max-w-[1500px] mx-auto gap-6 p-4 md:p-6 lg:p-8 mt-4">
        {/* Left Side: Cart Items */}
        <section className="flex-1 bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 pb-2 flex justify-between items-end mb-4">
            <h1 className="text-3xl tracking-tight leading-tight m-0 font-normal">Shopping Cart</h1>
            <span className="text-sm font-medium text-gray-500 hidden sm:block">Price</span>
          </div>

          {items.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-medium mb-4">Your AmaZon Cart is empty.</h2>
              <p className="text-sm">Check your Saved for later items below or continue shopping.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <span className="text-sm text-gray-700 font-medium">
              Subtotal ({cartCount} item{cartCount === 1 ? "" : "s"}):{" "}
              <b className="text-lg">{formatPrice(items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0))}</b>
            </span>
          </div>
        </section>

        {/* Right Side: Checkout Summary */}
        <aside className="w-full lg:w-[350px]">
          {items.length > 0 && <OrderSummary />}
        </aside>
      </main>
    </div>
  );
}
