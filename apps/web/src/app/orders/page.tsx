"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/layout/Navbar";
import { OrderService } from "../../services/api";
import { authClient } from "../../lib/auth-client";
import { Package, ChevronRight, Truck } from "lucide-react";

export default function OrdersPage() {
  const { data: session, isPending } = authClient.useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await OrderService.getOrders();
        setOrders(res.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [session, isPending]);

  // Not logged in
  if (!isPending && !session) {
    return (
      <div className="flex flex-col min-h-screen bg-[#eaeded]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-10">
          <Package className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-medium mb-2 text-gray-800">Sign in to view your orders</h2>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Track, return, or buy items again from your order history.
          </p>
          <Link
            href="/login"
            className="bg-[#ffd814] hover:bg-[#f7ca00] px-8 py-2.5 rounded-full font-medium text-sm shadow-sm transition-colors border border-transparent hover:border-[#f2c200]"
          >
            Sign in to your account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#eaeded]">
      <Navbar />

      <main className="max-w-[1100px] mx-auto w-full px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-medium text-gray-900">Your Orders</h1>
          <div className="text-sm text-gray-500">
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#f90] rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-lg border border-red-200 p-6 text-center">
            <p className="text-red-600 font-medium mb-2">Something went wrong</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 flex flex-col items-center">
            <Package className="h-20 w-20 text-gray-200 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-500 text-sm mb-6 text-center max-w-md">
              Looks like you haven&apos;t placed any orders. Start shopping to see your orders here!
            </p>
            <Link
              href="/"
              className="bg-[#ffd814] hover:bg-[#f7ca00] px-6 py-2.5 rounded-full font-medium text-sm shadow-sm transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="flex flex-col gap-4">
            {orders.map((order: any) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ═══ Individual Order Card ═══ */
function OrderCard({ order }: { order: any }) {
  const statusColors: Record<string, string> = {
    PENDING: "text-[#e77600] bg-[#fef3e2]",
    PROCESSING: "text-[#007185] bg-[#e5f5f7]",
    SHIPPED: "text-[#1a8cff] bg-[#e8f4ff]",
    DELIVERED: "text-[#007600] bg-[#e6f5e6]",
    CANCELLED: "text-[#CC0C39] bg-[#fde8ec]",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <Package className="h-4 w-4" />,
    PROCESSING: <Package className="h-4 w-4" />,
    SHIPPED: <Truck className="h-4 w-4" />,
    DELIVERED: <Package className="h-4 w-4" />,
    CANCELLED: <Package className="h-4 w-4" />,
  };

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Order Header */}
      <div className="bg-[#f0f2f2] border-b border-gray-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex flex-wrap gap-6">
          <div>
            <span className="text-gray-500 uppercase text-xs block">Order placed</span>
            <span className="font-medium text-gray-900">{orderDate}</span>
          </div>
          <div>
            <span className="text-gray-500 uppercase text-xs block">Total</span>
            <span className="font-medium text-gray-900">${Number(order.totalAmount).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500 uppercase text-xs block">Ship to</span>
            <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer font-medium">
              {order.user?.name || "User"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-gray-500 uppercase text-xs block">Order #</span>
          <span className="text-[#007185] text-xs font-mono">{order.id.slice(0, 16).toUpperCase()}</span>
        </div>
      </div>

      {/* Order Body */}
      <div className="px-5 py-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || "text-gray-600 bg-gray-100"}`}>
              {statusIcons[order.status]}
              {order.status}
            </span>
            {order.status === "PENDING" && (
              <span className="text-sm text-gray-500">— Arriving in 3-5 business days</span>
            )}
            {order.status === "DELIVERED" && (
              <span className="text-sm text-[#007600]">— Delivered successfully</span>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="flex flex-col divide-y divide-gray-100">
          {order.orderItems?.map((item: any) => (
            <div key={item.id} className="flex gap-4 py-3">
              {/* Product Image */}
              <Link href={`/product/${item.product?.id || item.productId}`} className="shrink-0">
                <img
                  src={item.product?.images?.[0] || "https://placehold.co/100"}
                  alt={item.product?.name || "Product"}
                  loading="lazy"
                  decoding="async"
                  className="w-20 h-20 object-contain rounded border border-gray-100 bg-white p-1"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.product?.id || item.productId}`}
                  className="text-sm text-[#007185] hover:text-[#c45500] hover:underline line-clamp-2 font-medium"
                >
                  {item.product?.name || "Product"}
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                <Link
                  href={`/product/${item.product?.id || item.productId}`}
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-xs font-medium py-1.5 px-4 rounded-full shadow-sm transition-colors text-center border border-transparent hover:border-[#f2c200]"
                >
                  Buy it again
                </Link>
                <Link
                  href={`/product/${item.product?.id || item.productId}`}
                  className="text-xs text-[#007185] hover:text-[#c45500] hover:underline text-center"
                >
                  View your item
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Footer */}
      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-1 text-sm text-[#007185] hover:text-[#c45500] cursor-pointer group">
          <span className="group-hover:underline">Order details</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
