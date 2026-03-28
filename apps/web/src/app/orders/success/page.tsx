"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center p-6 bg-white">
      <div className="flex flex-col items-center bg-gray-50 p-10 rounded-lg shadow-sm w-[600px] border border-gray-200">
        <CheckCircle className="text-green-600 w-24 h-24 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Order placed, thank you!</h1>
        <p className="text-lg text-gray-700 mb-8 text-center leading-relaxed">
          Confirmation will be sent to your email. <br/>
          Your order will be shipped to you soon, and you can track its progress in your orders portal.
        </p>

        <Link 
          href="/" 
          className="bg-[#ffd814] w-[300px] text-center hover:bg-[#f7ca00] py-3 rounded-full font-bold shadow-sm transition-colors cursor-pointer border border-[#f2c200]"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
