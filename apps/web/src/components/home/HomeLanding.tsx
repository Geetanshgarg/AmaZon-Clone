"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductService } from "../../services/api";
import { formatPrice } from "../../lib/utils";

interface HomeLandingProps {
  categories: any[];
}

export const HomeLanding = ({ categories }: HomeLandingProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    ProductService.getProducts({ limit: 15 })
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);

  const carouselImages = [
    "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg",
    "https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg",
    "https://m.media-amazon.com/images/I/81KkrQWEHIL._SX3000_.jpg",
  ];

  const electronicsImages = [
    "https://m.media-amazon.com/images/I/61lwJy4B8PL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/71Ie3JXGfVL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/81KkrQWEHIL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UL320_.jpg",
  ];

  const fashionImages = [
    "https://m.media-amazon.com/images/I/61-p3p8wEYL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/71li-ujtlUL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/71yZ4F1k0CL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/71HblAHs5xL._AC_UL320_.jpg",
  ];

  const homeImages = [
    "https://m.media-amazon.com/images/I/71g2ednj0JL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/71zKJrP1wPL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/61oCISLE+PL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/71K8huJgRLL._AC_UL320_.jpg",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full pb-10 bg-[#e3e6e6]">
      {/* ═══ Hero Carousel ═══ */}
      <div className="relative w-full h-[600px] overflow-hidden group">
        <div 
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselImages.map((src, index) => (
            <img 
              key={index}
              src={src}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover shrink-0"
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#e3e6e6] via-transparent to-transparent pointer-events-none" />

        <button 
          onClick={prevSlide}
          className="absolute left-0 top-0 bottom-[150px] px-8 text-white hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100 hidden md:block"
        >
          <ChevronLeft className="h-12 w-12" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-0 top-0 bottom-[150px] px-8 text-white hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100 hidden md:block"
        >
          <ChevronRight className="h-12 w-12" />
        </button>
      </div>

      {/* ═══ Feature Cards Grid (Row 1) ═══ */}
      <div className="max-w-[1500px] mx-auto px-4 -mt-[300px] relative z-10 w-full mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card: Shop by Category */}
          <div className="bg-white p-5 flex flex-col shadow-sm">
            <h2 className="text-[21px] font-bold mb-3">Shop by Category</h2>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {categories.slice(0, 4).map((cat, idx) => {
                const imgToUse = products[idx]?.images?.[0] || "https://placehold.co/320";
                return (
                  <Link 
                    key={cat.id} 
                    href={`/?categoryId=${cat.id}`}
                    className="flex flex-col gap-1 group cursor-pointer"
                  >
                    <div className="bg-gray-100 aspect-square overflow-hidden">
                      <img 
                        src={imgToUse} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        alt={cat.name}
                      />
                    </div>
                    <span className="text-xs text-gray-700">{cat.name}</span>
                  </Link>
                );
              })}
            </div>
            <Link href="/?search=" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mt-4">See more</Link>
          </div>

          {/* Card: Electronics */}
          <div className="bg-white p-5 flex flex-col shadow-sm">
            <h2 className="text-[21px] font-bold mb-3">Up to 70% off | Electronics</h2>
            <Link href={products[4]?.id ? `/product/${products[4].id}` : "/?categoryId=electronics"} className="flex-1 overflow-hidden group">
               <img src={products[4]?.images?.[0] || "https://placehold.co/320"} className="w-full h-[250px] object-contain group-hover:scale-105 transition-transform" alt="Electronics" />
            </Link>
            <Link href="/?categoryId=electronics" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mt-4">Shop now</Link>
          </div>

          {/* Card: Home & Kitchen */}
          <div className="bg-white p-5 flex flex-col shadow-sm">
            <h2 className="text-[21px] font-bold mb-3">Home & Kitchen | Under ₹499</h2>
            <div className="grid grid-cols-2 gap-3 flex-1">
               {products.slice(5, 9).map((prod, i) => (
                  <Link key={i} href={prod?.id ? `/product/${prod.id}` : "/?search=kitchen"} className="flex flex-col gap-1 group">
                     <img src={prod?.images?.[0] || "https://placehold.co/320"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Home" />
                     <span className="text-[10px] truncate max-w-full group-hover:text-[#c45500]">{prod?.name || `Essential ${i+1}`}</span>
                  </Link>
               ))}
            </div>
            <Link href="/?search=kitchen" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mt-4">Shop now</Link>
          </div>

          {/* Card: Top Deals */}
          <div className="bg-white p-5 flex flex-col shadow-sm">
            <h2 className="text-[21px] font-bold mb-3">Today's Deals</h2>
            <Link href={products[9]?.id ? `/product/${products[9].id}` : "/?search="} className="flex-1 overflow-hidden relative group">
               <img src={products[9]?.images?.[0] || "https://placehold.co/320"} className="w-full h-[250px] object-contain group-hover:scale-105 transition-transform" alt="Deals" />
               <div className="absolute bottom-2 left-0 bg-[#CC0C39] text-white px-2 py-0.5 text-xs font-bold">Up to 45% off</div>
            </Link>
            <Link href="/?search=" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mt-4">See all deals</Link>
          </div>
        </div>
      </div>

      {/* ═══ Feature Cards Grid (Row 2) ═══ */}
      <div className="max-w-[1500px] mx-auto px-4 w-full mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
           {/* Card: Fashion */}
           <div className="bg-white p-5 flex flex-col shadow-sm">
            <h2 className="text-[21px] font-bold mb-3">Min. 60% off | Fashion</h2>
            <div className="grid grid-cols-2 gap-3 flex-1">
               {products.slice(10, 14).map((prod, idx) => (
                  <Link key={idx} href={prod?.id ? `/product/${prod.id}` : "/?categoryId=fashion"} className="flex flex-col gap-1 group">
                    <img src={prod?.images?.[0] || "https://placehold.co/320"} className="w-full h-full object-contain group-hover:scale-105 transition-transform" alt="Fashion" />
                    <span className="text-[10px] truncate max-w-full group-hover:text-[#c45500]">{prod?.name || ["Mens", "Womens", "Jeans", "Footwear"][idx]}</span>
                  </Link>
               ))}
            </div>
            <Link href="/?categoryId=fashion" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mt-4">Explore all</Link>
          </div>

          <div className="bg-white p-5 flex flex-col shadow-sm">
            <h2 className="text-[21px] font-bold mb-3">Automotive essentials</h2>
            <Link href={products[0]?.id ? `/product/${products[0].id}` : "/?search=auto"} className="flex-1 overflow-hidden group">
               <img src={products[0]?.images?.[0] || "https://placehold.co/320"} className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform" alt="Auto" />
            </Link>
            <Link href="/?search=auto" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mt-4">Shop now</Link>
          </div>

          <div className="bg-white p-5 flex flex-col shadow-sm">
            <h2 className="text-[21px] font-bold mb-3">Appliances for your home</h2>
            <div className="grid grid-cols-2 gap-3 flex-1">
               <Link href={products[1]?.id ? `/product/${products[1].id}` : "/?categoryId=appliances"} className="flex flex-col gap-1 items-center group">
                  <img src={products[1]?.images?.[0] || "https://placehold.co/320"} className="w-full h-[100px] object-contain group-hover:scale-105 transition-transform" alt="AC" />
                  <span className="text-[10px] truncate max-w-full text-center group-hover:text-[#c45500]">{products[1]?.name || "Small Appliances"}</span>
               </Link>
               <Link href={products[2]?.id ? `/product/${products[2].id}` : "/?categoryId=appliances"} className="flex flex-col gap-1 items-center group">
                  <img src={products[2]?.images?.[0] || "https://placehold.co/320"} className="w-full h-[100px] object-contain group-hover:scale-105 transition-transform" alt="Coffee" />
                  <span className="text-[10px] truncate max-w-full text-center group-hover:text-[#c45500]">{products[2]?.name || "Coffee Makers"}</span>
               </Link>
            </div>
            <Link href="/?categoryId=appliances" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mt-4">See more</Link>
          </div>

          <div className="bg-white p-5 flex flex-col shadow-sm">
            <h2 className="text-[21px] font-bold mb-3">Work from home essentials</h2>
            <Link href={products[3]?.id ? `/product/${products[3].id}` : "/?search=laptop"} className="flex-1 overflow-hidden group">
               <img src={products[3]?.images?.[0] || "https://placehold.co/320"} className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform" alt="WFH" />
            </Link>
            <Link href="/?search=laptop" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mt-4">Shop all</Link>
          </div>
        </div>
      </div>

      {/* ═══ Horizontal Product Ribbons ═══ */}
      <div className="max-w-[1500px] mx-auto px-4 w-full flex flex-col gap-5">
         {/* Ribbon 1 */}
         <div className="bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-[21px] font-bold">Today's Deals</h2>
                <Link href="/?search=" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">See all deals</Link>
            </div>
            <div className="flex overflow-x-auto gap-5 no-scrollbar pb-2">
                {products.length > 0 ? (
                  products.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`} className="min-w-[180px] w-[180px] flex flex-col gap-2 group cursor-pointer">
                        <div className="h-[180px] w-full bg-gray-50 flex items-center justify-center p-4">
                            <img src={product.images?.[0] || "https://placehold.co/180"} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" alt={product.name} />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-2">
                                <span className="bg-[#CC0C39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">Up to 40% off</span>
                                <span className="text-[#CC0C39] text-[12px] font-bold">Deal</span>
                            </div>
                            <span className="text-sm font-bold truncate w-full">{product.name}</span>
                            <span className="text-sm font-bold">{formatPrice(product.price)}</span>
                            <span className="text-xs text-gray-500 line-through">{formatPrice(product.price * 1.3)}</span>
                        </div>
                    </Link>
                  ))
                ) : (
                  [...electronicsImages, ...fashionImages].map((img, i) => (
                    <div key={i} className="min-w-[180px] flex flex-col gap-2 group cursor-pointer">
                        <div className="h-[180px] w-full bg-gray-50 flex items-center justify-center p-4">
                            <img src={img} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="bg-[#CC0C39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">Up to 40% off</span>
                                <span className="text-[#CC0C39] text-[12px] font-bold">Deal</span>
                            </div>
                            <span className="text-sm font-bold">{formatPrice(1999 + i * 200)}</span>
                            <span className="text-xs text-gray-500 line-through">{formatPrice(2999 + i * 200)}</span>
                        </div>
                    </div>
                  ))
                )}
            </div>
         </div>

         {/* Ribbon 2: Categories */}
         <div className="bg-white p-5 shadow-sm">
            <h2 className="text-[21px] font-bold mb-4">Explore categories</h2>
            <div className="flex overflow-x-auto gap-8 no-scrollbar pb-2">
                {categories.map((cat, idx) => {
                    const fallbackImg = products[idx % products.length]?.images?.[0] || "https://placehold.co/100";
                    return (
                      <Link key={cat.id} href={`/?categoryId=${cat.id}`} className="min-w-[100px] flex flex-col items-center gap-3 group">
                          <div className="h-[100px] w-[100px] rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-[#f90] transition-all">
                               <img src={fallbackImg} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs font-bold text-center">{cat.name}</span>
                      </Link>
                    );
                })}
            </div>
         </div>
      </div>
    </div>
  );
};
