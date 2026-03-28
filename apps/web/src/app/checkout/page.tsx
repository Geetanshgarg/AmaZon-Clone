"use client";

import { useCartStore } from "../../store/useCartStore";
import { OrderService } from "../../services/api";
import { authClient } from "../../lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Lock, AlertTriangle, Minus, Plus, Trash2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, cartCount, cartTotal, clearCart, updateQuantity, removeItem } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const deliveryStr = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const orderTotal = cartTotal * 1.08;

  const handlePlaceOrder = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      await OrderService.createOrder({
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      clearCart();
      router.push("/orders/success");
    } catch (e: any) {
      alert("Failed to place order: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartCount === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#eaeded]">
        <CheckoutHeader count={0} />
        <div className="flex-1 flex flex-col items-center justify-center p-10">
          <h2 className="text-2xl font-medium mb-4 text-gray-800">Your cart is empty.</h2>
          <p className="text-gray-500 mb-6">Add items to your cart before proceeding to checkout.</p>
          <Link
            href="/"
            className="bg-[#ffd814] hover:bg-[#f7ca00] px-6 py-2.5 rounded-full font-medium text-sm shadow-sm transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#eaeded]">
      {/* ═══ Checkout Header ═══ */}
      <CheckoutHeader count={cartCount} />

      {/* ═══ Main Content ═══ */}
      <main className="max-w-[1100px] mx-auto w-full px-4 py-5 flex flex-col lg:flex-row gap-5">
        {/* ═══ LEFT COLUMN ═══ */}
        <section className="flex-1 flex flex-col gap-4">
          {/* Delivery Address Card */}
          <div className="bg-white rounded-lg border border-gray-200 px-5 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Delivering to John Doe</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  123 Main Street, Suite 400, New York, NY 10001, United States
                </p>
                <button className="text-xs text-[#007185] hover:text-[#c45500] hover:underline mt-1.5 cursor-pointer">
                  Add delivery instructions
                </button>
              </div>
              <button className="text-sm text-[#007185] hover:text-[#c45500] hover:underline shrink-0 cursor-pointer">
                Change
              </button>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-lg border border-gray-200 px-5 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Pay on delivery (Cash/Card)</h3>
                <p className="text-sm text-[#007185] mt-1 hover:text-[#c45500] hover:underline cursor-pointer">
                  Use a gift card, voucher or promo code
                </p>
              </div>
              <button className="text-sm text-[#007185] hover:text-[#c45500] hover:underline shrink-0 cursor-pointer">
                Change
              </button>
            </div>
          </div>

          {/* OTP Warning */}
          <div className="border-2 border-[#f0ad4e] rounded-lg px-5 py-3 bg-[#fffdf7]">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-[#c48a1a] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-gray-900">One-time password required at time of delivery</p>
                <p className="text-sm text-gray-600 mt-0.5">
                  Please ensure someone will be available to receive this delivery.{" "}
                  <span className="text-[#007185] hover:underline cursor-pointer">Learn more.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-white rounded-lg border border-gray-200 px-5 py-4">
            {/* Delivery ETA */}
            <div className="mb-4">
              <h3 className="text-base font-bold text-[#007600]">Arriving {deliveryStr}</h3>
              <p className="text-xs text-gray-500 mt-0.5">If you order in the next 23 hours</p>
            </div>

            {/* Item List */}
            <div className="flex flex-col divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  {/* Image */}
                  <Link href={`/product/${item.id}`} className="shrink-0">
                    <img
                      src={item.imageUrl || "https://placehold.co/120"}
                      alt={item.name}
                      className="w-24 h-24 object-contain mix-blend-multiply"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.id}`}
                      className="text-sm text-gray-900 hover:text-[#c45500] line-clamp-2 leading-snug"
                    >
                      {item.name}
                    </Link>
                    <p className="text-base font-bold mt-1">${Number(item.price).toFixed(2)}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-[#007600] font-medium">✓ prime</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Ships from AmaZon <span className="font-medium text-gray-700">| Fulfilled</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Sold by <span className="text-[#007185] hover:underline cursor-pointer">AmaZon.com</span>
                    </p>

                    {/* Delivery option */}
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <input type="radio" checked readOnly className="accent-[#007185]" />
                      <span className="font-bold">{deliveryStr.split(",")[0]}, {deliveryStr.split(",")[1]?.trim()}</span>
                      <span className="text-xs text-gray-500">FREE Prime Delivery</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity Controls */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-0 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    {item.quantity <= 1 ? (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="px-2 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 text-gray-600" />
                      </button>
                    ) : (
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                    )}
                    <span className="px-4 py-1 text-sm font-medium bg-gray-50 min-w-[36px] text-center border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
              <button className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mt-2 cursor-pointer">
                Add gift options
              </button>
            </div>
          </div>

          {/* Bottom Place Order Bar */}
          <div className="bg-white rounded-lg border border-gray-200 px-5 py-4">
            <div className="flex items-center gap-6">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-medium py-2.5 px-8 rounded-full shadow-sm transition-all cursor-pointer border border-transparent hover:border-[#f2c200] disabled:bg-gray-300 disabled:cursor-not-allowed shrink-0"
              >
                {loading ? "Placing Order..." : "Place your order"}
              </button>
              <div>
                <span className="text-lg font-bold">Order Total: ${orderTotal.toFixed(2)}</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  By placing your order, you agree to AmaZon&apos;s{" "}
                  <span className="text-[#007185] hover:underline cursor-pointer">privacy notice</span> and{" "}
                  <span className="text-[#007185] hover:underline cursor-pointer">conditions of use</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Help Footer */}
          <div className="bg-white rounded-lg border border-gray-200 px-5 py-4 text-xs text-gray-600">
            <p>
              Need help? Check our{" "}
              <span className="text-[#007185] hover:underline cursor-pointer">help pages</span> or{" "}
              <span className="text-[#007185] hover:underline cursor-pointer">contact us 24x7</span>
            </p>
            <p className="mt-2 leading-relaxed">
              When your order is placed, we&apos;ll send you an e-mail message acknowledging receipt of your order.
              If you choose to pay using an electronic payment method (credit card, debit card or net banking),
              you will be directed to your bank&apos;s website to complete your payment.
            </p>
            <p className="mt-2">
              See AmaZon&apos;s{" "}
              <span className="text-[#007185] hover:underline cursor-pointer">Return Policy</span>.
            </p>
            <Link
              href="/cart"
              className="text-[#007185] hover:text-[#c45500] hover:underline mt-2 inline-block"
            >
              Back to cart
            </Link>
          </div>
        </section>

        {/* ═══ RIGHT COLUMN — Order Summary ═══ */}
        <aside className="lg:w-[300px] shrink-0">
          <div className="sticky top-4 flex flex-col gap-4">
            {/* Place Order Box */}
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-4">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-medium py-2.5 rounded-full shadow-sm transition-all cursor-pointer border border-transparent hover:border-[#f2c200] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? "Placing Order..." : "Place your order"}
              </button>
              <p className="text-[11px] text-gray-500 mt-2.5 leading-relaxed text-center">
                By placing your order, you agree to AmaZon&apos;s{" "}
                <span className="text-[#007185] hover:underline cursor-pointer">privacy notice</span> and{" "}
                <span className="text-[#007185] hover:underline cursor-pointer">conditions of use</span>.
              </p>

              <hr className="my-3 border-gray-200" />

              {/* Order Summary */}
              <div className="text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-700">Items:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Delivery:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Estimated tax:</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
              </div>

              <hr className="my-3 border-gray-200" />

              <div className="flex justify-between text-lg font-bold text-[#B12704]">
                <span>Order Total:</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* ═══ Footer ═══ */}
      <footer className="mt-auto">
        <div className="bg-[#37475A] text-white text-center py-3 text-sm cursor-pointer hover:bg-[#485769] transition-colors">
          Back to top
        </div>
        <div className="bg-[#131A22] text-center py-6">
          <p className="text-2xl font-bold tracking-tighter text-white mb-2">
            Ama<span className="text-[#f90]">Z</span>on
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-3">
            <span className="hover:text-white cursor-pointer hover:underline">Conditions of Use & Sale</span>
            <span className="hover:text-white cursor-pointer hover:underline">Privacy Notice</span>
            <span className="hover:text-white cursor-pointer hover:underline">Interest-Based Ads</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">© 1996-2026, AmaZon.com, Inc. or its affiliates</p>
        </div>
      </footer>
    </div>
  );
}

/* ═══ Checkout Header Component ═══ */
function CheckoutHeader({ count }: { count: number }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 w-full bg-[#131921] text-white">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between px-4 py-2 gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center p-2 border border-transparent hover:border-white rounded-sm"
        >
          <span className="text-2xl font-bold tracking-tighter">
            Ama<span className="text-[#f90]">Z</span>on
          </span>
        </Link>

        {/* Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-normal text-white">Secure checkout</h1>
          <Lock className="h-4 w-4 text-gray-400" />
        </div>

        {/* Cart */}
        <Link
          href="/cart"
          className="flex items-center p-2 border border-transparent hover:border-white rounded-sm"
        >
          <div className="relative flex items-center">
            <ShoppingCart className="h-8 w-8" />
            <span className="absolute -top-1 left-[14px] text-[#f90] font-bold text-md">
              {count}
            </span>
          </div>
          <span className="text-sm font-bold mt-4 hidden md:block">Cart</span>
        </Link>
      </div>
    </header>
  );
}
