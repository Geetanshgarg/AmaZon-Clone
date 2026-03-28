"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, MapPin } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { authClient } from "../../lib/auth-client";

export const Navbar = () => {
  const cartCount = useCartStore((state) => state.cartCount);
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#131921] text-white">
      {/* Main Navbar */}
      <div className="flex px-4 py-2 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center p-2 border border-transparent hover:border-white rounded-sm mt-1">
          <span className="text-2xl font-bold tracking-tighter font-sans">
            Ama<span className="text-[#f90]">Z</span>on
          </span>
        </Link>

        {/* Deliver To */}
        <div className="hidden md:flex items-center p-2 border border-transparent hover:border-white rounded-sm cursor-pointer whitespace-nowrap">
          <MapPin className="h-4 w-4 mt-2" />
          <div className="flex flex-col leading-tight ml-1">
            <span className="text-xs text-gray-300">Deliver to</span>
            <span className="text-sm font-bold">New York 10001</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#f90] transition-all">
          <select className="hidden md:block bg-gray-100 border-r border-gray-300 text-black px-2 text-sm outline-none cursor-pointer hover:bg-gray-200">
            <option>All</option>
            <option>Electronics</option>
            <option>Books</option>
          </select>
          <input
            type="text"
            className="flex-1 px-4 text-black outline-none placeholder-gray-500 text-base"
            placeholder="Search AmaZon"
          />
          <button className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center transition-colors">
            <Search className="h-5 w-5 text-gray-800" />
          </button>
        </div>

        {/* Account & Lists */}
        {session ? (
          <div className="hidden md:flex flex-col p-2 border border-transparent hover:border-white rounded-sm cursor-pointer leading-tight whitespace-nowrap group relative">
            <span className="text-xs">Hello, {session.user.name || session.user.email}</span>
            <span className="text-sm font-bold">Account & Lists</span>
            
            {/* Simple Dropdown for sign out */}
            <div className="absolute top-10 -right-4 bg-white text-black p-4 shadow-xl border border-gray-200 rounded-md hidden group-hover:flex flex-col gap-2 z-50 min-w-[150px]">
              <div className="font-bold border-b pb-2 mb-2 border-gray-100">Your Account</div>
              <button 
                onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => window.location.reload() } })} 
                className="text-sm text-left hover:underline text-[#007185] hover:text-[#c45500]"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <Link href="/login" className="hidden md:flex flex-col p-2 border border-transparent hover:border-white rounded-sm cursor-pointer leading-tight whitespace-nowrap">
            <span className="text-xs">Hello, sign in</span>
            <span className="text-sm font-bold">Account & Lists</span>
          </Link>
        )}

        {/* Returns & Orders */}
        <div className="hidden lg:flex flex-col p-2 border border-transparent hover:border-white rounded-sm cursor-pointer leading-tight whitespace-nowrap">
          <span className="text-xs">Returns</span>
          <span className="text-sm font-bold">& Orders</span>
        </div>

        {/* Cart */}
        <Link href="/cart" className="flex items-center p-2 border border-transparent hover:border-white rounded-sm">
          <div className="relative flex items-center">
            <ShoppingCart className="h-8 w-8" />
            <span className="absolute -top-1 left-[14px] text-[#f90] font-bold text-md bg-transparent">
              {cartCount}
            </span>
          </div>
          <span className="text-sm font-bold mt-4 hidden md:block">Cart</span>
        </Link>
      </div>

      {/* Sub Navbar */}
      <div className="bg-[#232f3e] px-4 py-1.5 flex items-center gap-4 text-sm font-medium">
        <button className="flex items-center gap-1 border border-transparent hover:border-white p-1 rounded-sm">
          <Menu className="h-5 w-5" />
          All
        </button>
        <span className="hidden sm:inline-block cursor-pointer p-1 border border-transparent hover:border-white rounded-sm">Today's Deals</span>
        <span className="hidden sm:inline-block cursor-pointer p-1 border border-transparent hover:border-white rounded-sm">Customer Service</span>
        <span className="hidden md:inline-block cursor-pointer p-1 border border-transparent hover:border-white rounded-sm">Registry</span>
        <span className="hidden lg:inline-block cursor-pointer p-1 border border-transparent hover:border-white rounded-sm">Gift Cards</span>
        <span className="hidden lg:inline-block cursor-pointer p-1 border border-transparent hover:border-white rounded-sm">Sell</span>
      </div>
    </header>
  );
};
