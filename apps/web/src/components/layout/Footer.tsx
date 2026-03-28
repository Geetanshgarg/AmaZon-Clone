"use client";

import React from "react";
import Link from "next/link";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full flex flex-col mt-auto">
      {/* Back to top */}
      <button 
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-white py-4 text-xs font-medium transition-colors"
      >
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="bg-[#232f3e] text-white py-12">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 px-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold mb-2">Get to Know Us</h3>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">About Us</span>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">Careers</span>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">Press Releases</span>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">Amazon Science</span>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold mb-2">Connect with Us</h3>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">Facebook</span>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">Twitter</span>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">Instagram</span>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold mb-2">Make Money with Us</h3>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">Sell on Amazon</span>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">Sell under Amazon Accelerator</span>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">Protect and Build Your Brand</span>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">Amazon Global Selling</span>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold mb-2">Let Us Help You</h3>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">COVID-19 and Amazon</span>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">Your Account</span>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">Returns Centre</span>
            <span className="text-sm text-gray-300 hover:underline cursor-pointer">100% Purchase Protection</span>
          </div>
        </div>

        <hr className="border-gray-700 my-10 max-w-[1000px] mx-auto" />

        <div className="flex justify-center items-center gap-20 px-6">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-tighter text-white">
              Ama<span className="text-[#f90]">Z</span>on
            </span>
          </Link>
          <div className="flex gap-4 border border-gray-600 rounded-sm p-2 text-xs text-gray-300 cursor-pointer hover:border-white">
             <span>English</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal Section */}
      <div className="bg-[#131a22] text-white py-10">
        <div className="max-w-[1000px] mx-auto flex flex-col items-center gap-4 text-[12px] px-6">
          <div className="flex gap-6 text-gray-300">
            <span className="hover:underline cursor-pointer">Conditions of Use & Sale</span>
            <span className="hover:underline cursor-pointer">Privacy Notice</span>
            <span className="hover:underline cursor-pointer">Interest-Based Ads</span>
          </div>
          <span className="text-gray-400">© 1996-2026, AmaZon-Clone.com, Inc. or its affiliates</span>
        </div>
      </div>
    </footer>
  );
};
