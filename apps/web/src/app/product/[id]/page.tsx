"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductService } from "../../../services/api";
import { useCartStore } from "../../../store/useCartStore";
import { Navbar } from "../../../components/layout/Navbar";
import { Star, MapPin, ShieldCheck, RotateCcw, Truck, Check } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQty, setSelectedQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await ProductService.getProductById(id as string);
        setProduct(res.data);
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < selectedQty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl || "",
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  // Generate fake delivery date (tomorrow)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 1);
  const deliveryStr = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Generate fakefast delivery date (today)
  const fastDeliveryDate = new Date();
  const fastDeliveryStr = fastDeliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center flex-1">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#f90] rounded-full animate-spin" />
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <h2 className="text-2xl font-medium mb-2 text-gray-900">Product not found</h2>
            <p className="text-gray-500 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/" className="text-[#007185] hover:text-[#c45500] hover:underline">
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rating = 4.2;
  const reviewCount = 1489;
  const originalPrice = Number(product.price) * 1.35;
  const discountPct = Math.round((1 - Number(product.price) / originalPrice) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="max-w-[1500px] mx-auto w-full px-4 pt-3 pb-1">
        <nav className="text-xs text-[#007185]">
          <Link href="/" className="hover:text-[#c45500] hover:underline">Home</Link>
          <span className="text-gray-400 mx-1">›</span>
          <span className="text-gray-500">{product.category?.name || "Products"}</span>
          <span className="text-gray-400 mx-1">›</span>
          <span className="text-gray-500 truncate max-w-[200px] inline-block align-bottom">{product.name}</span>
        </nav>
      </div>

      {/* Main product area: 3-column layout */}
      <main className="max-w-[1500px] mx-auto w-full px-4 py-2">
        <div className="flex flex-col lg:flex-row gap-4">

          {/* ═══ LEFT COLUMN — Product Image ═══ */}
          <div className="lg:w-[40%] shrink-0">
            <div className="sticky top-20">
              {/* Main Image */}
              <div className="border border-gray-200 rounded-md overflow-hidden bg-white flex items-center justify-center p-6 min-h-[400px] max-h-[500px]">
                <img
                  src={product.imageUrl || "https://placehold.co/600"}
                  alt={product.name}
                  className="max-w-full max-h-[450px] object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                />
              </div>

              {/* Thumbnail strip placeholder */}
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-14 h-14 border-2 ${i === 1 ? "border-[#e77600]" : "border-gray-200 hover:border-[#e77600]"} rounded-md overflow-hidden bg-white flex items-center justify-center p-1 cursor-pointer transition-colors`}
                  >
                    <img
                      src={product.imageUrl || "https://placehold.co/100"}
                      alt={`Thumbnail ${i}`}
                      className="max-w-full max-h-full object-contain opacity-90"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ MIDDLE COLUMN — Product Info ═══ */}
          <div className="lg:w-[35%] flex-1 lg:px-4">
            {/* Title */}
            <h1 className="text-2xl font-normal leading-tight text-gray-900 tracking-tight">
              {product.name}
            </h1>

            {/* Brand / Store */}
            <p className="mt-1">
              <span className="text-sm text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">
                Visit the AmaZon Store
              </span>
            </p>

            {/* Rating Row */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {/* Star rating */}
              <span className="text-sm text-[#007185] font-medium">{rating}</span>
              <div className="flex text-[#de7921]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-[18px] w-[18px] ${i < Math.floor(rating) ? "fill-current" : i < rating ? "fill-current opacity-50" : ""}`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">
                {reviewCount.toLocaleString()} ratings
              </span>
            </div>

            <hr className="my-3 border-gray-200" />

            {/* Price Section */}
            <div className="mb-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#CC0C39] text-2xl font-medium">-{discountPct}%</span>
                <div className="flex items-start">
                  <span className="text-sm align-top mt-1">$</span>
                  <span className="text-[32px] leading-none font-medium tracking-tight">
                    {Math.floor(Number(product.price))}
                  </span>
                  <span className="text-sm align-top mt-1">
                    {(Number(product.price) % 1).toFixed(2).substring(2)}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                M.R.P.: <span className="line-through">${originalPrice.toFixed(2)}</span>
              </div>

              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Offers Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 mt-3">
              <h3 className="font-bold text-base mb-2">Save Extra with 2 offers</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <span className="bg-[#CC0C39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shrink-0 mt-0.5">Sale</span>
                  <p className="text-sm text-gray-800">Get <b>10% instant discount</b> on orders above $50</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-[#CC0C39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shrink-0 mt-0.5">Sale</span>
                  <p className="text-sm text-gray-800"><b>No Cost EMI</b> available on select cards. <span className="text-[#007185] hover:underline cursor-pointer">Details</span></p>
                </div>
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Product Info Table */}
            <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
              <span className="text-gray-600 font-bold">Brand</span>
              <span className="text-gray-900">AmaZon</span>

              <span className="text-gray-600 font-bold">Item Weight</span>
              <span className="text-gray-900">250 Grams</span>

              <span className="text-gray-600 font-bold">Item Form</span>
              <span className="text-gray-900">Standard</span>

              <span className="text-gray-600 font-bold">Material</span>
              <span className="text-gray-900">Premium Quality</span>

              <span className="text-gray-600 font-bold">Number of Items</span>
              <span className="text-gray-900">1</span>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* About This Item */}
            <div>
              <h3 className="text-base font-bold mb-2">About this item</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800 leading-relaxed">
                {product.description ? (
                  product.description.split(". ").filter(Boolean).map((line: string, idx: number) => (
                    <li key={idx}>{line.trim()}{!line.endsWith(".") ? "." : ""}</li>
                  ))
                ) : (
                  <>
                    <li>Premium quality product for everyday use</li>
                    <li>Carefully crafted with the best materials</li>
                    <li>Suitable for a wide range of applications</li>
                  </>
                )}
              </ul>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Extra Detail Row (icons) */}
            <div className="flex items-center justify-start gap-6 text-center py-2">
              <div className="flex flex-col items-center gap-1 w-16">
                <Truck className="h-8 w-8 text-[#007185]" />
                <span className="text-[11px] text-[#007185]">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-16">
                <RotateCcw className="h-8 w-8 text-[#007185]" />
                <span className="text-[11px] text-[#007185]">10 Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-20">
                <ShieldCheck className="h-8 w-8 text-[#007185]" />
                <span className="text-[11px] text-[#007185]">Secure Transaction</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-20">
                <Check className="h-8 w-8 text-[#007185]" />
                <span className="text-[11px] text-[#007185]">Top Brand</span>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT COLUMN — Buy Box ═══ */}
          <div className="lg:w-[25%] shrink-0">
            <div className="border border-gray-300 rounded-lg p-5 sticky top-20">
              {/* Price in buy box */}
              <div className="flex items-start mb-1">
                <span className="text-sm align-top mt-1">$</span>
                <span className="text-[28px] leading-none font-medium tracking-tight">
                  {Math.floor(Number(product.price))}
                </span>
                <span className="text-sm align-top mt-1">
                  {(Number(product.price) % 1).toFixed(2).substring(2)}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-2">
                M.R.P.: <span className="line-through">${originalPrice.toFixed(2)}</span>
                <span className="ml-1">({discountPct}% off)</span>
              </p>

              <p className="text-xs text-gray-500 mb-3">Inclusive of all taxes</p>

              {/* Delivery Info */}
              <div className="text-sm mb-1">
                <span className="text-gray-800">FREE delivery </span>
                <span className="font-bold text-gray-900">{deliveryStr}</span>
              </div>
              <div className="text-sm mb-3 text-gray-600">
                Or fastest delivery <span className="font-bold text-gray-900">{fastDeliveryStr}</span>
              </div>

              {/* Delivery location */}
              <div className="flex items-center gap-1 text-xs text-[#007185] mb-4 cursor-pointer hover:text-[#c45500]">
                <MapPin className="h-3.5 w-3.5" />
                <span className="hover:underline">Deliver to New York 10001</span>
              </div>

              {/* Stock Status */}
              <p className={`text-lg font-medium mb-3 ${product.stock > 0 ? "text-[#007600]" : "text-red-600"}`}>
                {product.stock > 0 ? "In Stock" : "Currently Unavailable"}
              </p>

              {product.stock > 0 && (
                <>
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-700">Qty:</span>
                    <select
                      value={selectedQty}
                      onChange={(e) => setSelectedQty(Number(e.target.value))}
                      className="bg-gray-100 border border-gray-300 rounded-lg text-sm px-3 py-1.5 outline-none cursor-pointer hover:bg-gray-200 shadow-sm"
                    >
                      {[...Array(Math.min(product.stock, 30))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-sm font-medium py-2.5 rounded-full shadow-sm hover:shadow transition-all cursor-pointer border border-transparent hover:border-[#f2c200] mb-2"
                  >
                    {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
                  </button>

                  {/* Buy Now */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-sm font-medium py-2.5 rounded-full shadow-sm hover:shadow transition-all cursor-pointer border border-transparent hover:border-[#e3771a] mb-4"
                  >
                    Buy Now
                  </button>
                </>
              )}

              {/* Seller Info */}
              <div className="text-xs space-y-1.5 text-gray-600 pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span>Ships from</span>
                  <span className="text-[#007185]">AmaZon.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Sold by</span>
                  <span className="text-[#007185]">AmaZon.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Returns</span>
                  <span className="text-[#007185] hover:underline cursor-pointer">30-Day Refund/Replacement</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment</span>
                  <span className="text-[#007185]">Secure transaction</span>
                </div>
              </div>

              <hr className="my-3 border-gray-200" />

              {/* Gift Option */}
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="min-w-4 h-4 accent-[#007185]" />
                <label>Add a gift receipt for easy returns</label>
              </div>

              {/* Add to Wish List */}
              <button className="w-full mt-3 text-xs text-[#007185] hover:underline hover:text-[#c45500] text-left">
                Add to Wish List
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Product details section */}
      <section className="max-w-[1500px] mx-auto w-full px-4 py-6 mt-4 border-t border-gray-200">
        <h2 className="text-xl font-bold mb-4">Product details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-sm max-w-3xl">
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">Product Dimensions</span>
            <span className="text-gray-900">10 x 10 x 5 cm</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">Date First Available</span>
            <span className="text-gray-900">1 January 2024</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">Manufacturer</span>
            <span className="text-gray-900">AmaZon Corp.</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">ASIN</span>
            <span className="text-gray-900">{product.id.toUpperCase().slice(0, 10)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">Item model number</span>
            <span className="text-gray-900">AMZ-{product.id.slice(-4).toUpperCase()}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">Customer Reviews</span>
            <div className="flex items-center gap-1">
              <div className="flex text-[#de7921]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? "fill-current" : ""}`} />
                ))}
              </div>
              <span className="text-[#007185] text-xs">{reviewCount.toLocaleString()} ratings</span>
            </div>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">Best Sellers Rank</span>
            <span className="text-gray-900">#42 in Electronics</span>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-[1500px] mx-auto w-full px-4 py-6 border-t border-gray-200">
        <h2 className="text-xl font-bold mb-4">Customer reviews</h2>
        <div className="flex flex-col md:flex-row gap-8 max-w-4xl">
          {/* Rating Summary */}
          <div className="md:w-[220px] shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-[#de7921]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-current" : ""}`} />
                ))}
              </div>
              <span className="text-lg font-medium">{rating} out of 5</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{reviewCount.toLocaleString()} global ratings</p>

            {/* Rating Bars */}
            {[
              { stars: 5, pct: 68 },
              { stars: 4, pct: 18 },
              { stars: 3, pct: 7 },
              { stars: 2, pct: 4 },
              { stars: 1, pct: 3 },
            ].map((r) => (
              <div key={r.stars} className="flex items-center gap-2 mb-1.5 text-sm cursor-pointer hover:underline text-[#007185]">
                <span className="w-14 shrink-0">{r.stars} star</span>
                <div className="flex-1 h-[18px] bg-gray-200 rounded-sm overflow-hidden">
                  <div className="h-full bg-[#de7921] rounded-sm" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="w-8 text-right text-gray-600">{r.pct}%</span>
              </div>
            ))}
          </div>

          {/* Sample Reviews */}
          <div className="flex-1 flex flex-col gap-6">
            {[
              { name: "John D.", rating: 5, title: "Excellent product!", body: "Exactly as described. Arrived quickly and well-packaged. Would definitely recommend to others.", date: "28 March 2026" },
              { name: "Sarah M.", rating: 4, title: "Good value for the price", body: "Works well for what I needed. Only minor complaint is the packaging could be better. Overall happy with the purchase.", date: "25 March 2026" },
              { name: "Raj P.", rating: 5, title: "Great quality", body: "Very impressed with the quality. Exceeded my expectations. Will be buying more items from this store.", date: "20 March 2026" },
            ].map((review, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                    {review.name[0]}
                  </div>
                  <span className="text-sm text-gray-700">{review.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-[#de7921]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-current" : ""}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold">{review.title}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">Reviewed on {review.date}</p>
                <p className="text-sm text-gray-800 leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer-like bottom padding */}
      <div className="h-12" />
    </div>
  );
}
