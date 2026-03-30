import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, Search, Menu, MapPin, User, ChevronRight } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { authClient } from "../../lib/auth-client";
import { ProductService } from "../../services/api";

export const Navbar = () => {
  return (
    <Suspense fallback={<div className="h-16 bg-[#131921] w-full" />}>
      <NavbarContent />
    </Suspense>
  );
};

const NavbarContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartCount = useCartStore((state) => state.cartCount);
  const { data: session } = authClient.useSession();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [categories, setCategories] = useState<any[]>([]);
  const [productSuggestions, setProductSuggestions] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Debouncing effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); 

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch product suggestions when debounced search changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setProductSuggestions([]);
      return;
    }

    const fetchProductSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const res = await ProductService.getProducts({ 
            search: debouncedSearch, 
            limit: 5 
        });
        setProductSuggestions(res.data || []);
      } catch (err) {
        console.error("Failed to fetch product suggestions", err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchProductSuggestions();
  }, [debouncedSearch]);

  useEffect(() => {
    // Prevent scrolling when sidebar is open
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ProductService.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories in navbar", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (categoryId) params.set("categoryId", categoryId);
    
    router.push(`/?${params.toString()}`);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login"); // Redirect to login after sign out
            setIsSidebarOpen(false);
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-[#131921] text-white">
      {/* ═══ Top Row ═══ */}
      <div className="flex px-2 md:px-4 py-1 items-center justify-between gap-1 md:gap-4 h-14 md:h-16">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="flex items-center p-1 md:p-2 border border-transparent hover:border-white rounded-sm">
            <span className="text-xl md:text-2xl font-bold tracking-tighter font-sans">
              Ama<span className="text-[#f90]">Z</span>on
              <span className="text-[10px] font-normal align-top ml-0.5">.in</span>
            </span>
          </Link>
        </div>

        {/* Deliver To (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center p-2 border border-transparent hover:border-white rounded-sm cursor-pointer whitespace-nowrap">
          <MapPin className="h-4 w-4 mt-2" />
          <div className="flex flex-col leading-tight ml-1">
            <span className="text-xs text-gray-300">Deliver to</span>
            <span className="text-sm font-bold">New York 10001</span>
          </div>
        </div>

        {/* Desktop Search Bar (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 relative h-10 ml-2">
          <form
            onSubmit={handleSearch}
            className="flex flex-1 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#f90] transition-all"
          >
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="bg-gray-100 border-r border-gray-300 text-black px-2 text-xs outline-none cursor-pointer hover:bg-gray-200 max-w-[130px]"
            >
              <option value="">All</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsSidebarOpen(false)}
              className="flex-1 px-3 text-black outline-none placeholder-gray-500 text-sm"
              placeholder="Search AmaZon.in"
            />
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center transition-colors"
            >
              <Search className="h-5 w-5 text-gray-800" />
            </button>
          </form>

          {/* Search Suggestions Dropdown */}
          {search.trim() && (categories.some(c => c.name.toLowerCase().includes(search.toLowerCase())) || productSuggestions.length > 0) && (
            <div className="absolute top-10 left-0 right-0 bg-white border border-gray-200 shadow-2xl rounded-b-md z-50 overflow-hidden">
              <ul className="text-black text-sm">
                {/* Category Suggestions */}
                {categories
                  .filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()))
                  .map(cat => (
                    <li 
                      key={cat.id}
                      onClick={() => {
                        router.push(`/?categoryId=${cat.id}`);
                        setSearch("");
                        setCategoryId(cat.id);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-50 flex items-center gap-2"
                    >
                      <Search className="h-3 w-3 text-gray-400" />
                      <span>in </span>
                      <span className="font-bold">{cat.name}</span>
                    </li>
                  ))}

                {/* Product Suggestions */}
                {productSuggestions.map(product => (
                  <li 
                    key={product.id}
                    onClick={() => {
                      router.push(`/product/${product.id}`);
                      setSearch("");
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-50 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-3 w-3 text-gray-400" />
                      <span className="truncate max-w-[300px]">{product.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-2">in products</span>
                  </li>
                ))}

                {isLoadingSuggestions && productSuggestions.length === 0 && (
                   <li className="px-4 py-3 text-gray-400 italic text-center text-xs">Loading suggestions...</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-0.5 md:gap-1">
          {/* Account */}
          <div className="group relative">
            <Link
              href={session ? "/orders" : ("/login" as any)}
              className="flex items-center p-2 border border-transparent hover:border-white rounded-sm leading-tight whitespace-nowrap"
            >
              <div className="md:hidden flex items-center gap-1">
                <span className="text-sm font-medium">{session ? session.user.name.split(' ')[0] : "Sign in"}</span>
                <User className="h-5 w-5" />
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs">Hello, {session ? session.user.name.split(' ')[0] : "sign in"}</span>
                <span className="text-sm font-bold">Account & Lists</span>
              </div>
            </Link>
            
            {/* Account Dropdown (Simplified) */}
            {session && (
              <div className="absolute top-full right-0 w-48 bg-white text-black shadow-xl border border-gray-200 hidden group-hover:block z-50 py-2 rounded-sm">
                <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100 text-sm">Your Orders</Link>
                <div className="border-t border-gray-100 my-1" />
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Returns & Orders (Hidden on Tablet/Mobile) */}
          <Link href="/orders" className="hidden lg:flex flex-col p-2 border border-transparent hover:border-white rounded-sm cursor-pointer leading-tight whitespace-nowrap">
            <span className="text-xs">Returns</span>
            <span className="text-sm font-bold">& Orders</span>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="flex items-center p-2 border border-transparent hover:border-white rounded-sm">
            <div className="relative flex items-center">
              <ShoppingCart className="h-7 w-7 md:h-8 md:w-8" />
              <span className="absolute -top-1 left-[12px] md:left-[14px] text-[#f90] font-bold text-sm md:text-md bg-transparent">
                {cartCount}
              </span>
            </div>
            <span className="text-sm font-bold mt-3 md:mt-4 hidden md:block">Cart</span>
          </Link>
        </div>
      </div>

      {/* ═══ Mobile Search Row (Only visible on small screens) ═══ */}
      <div className="md:hidden px-2 pb-2 relative">
        <form
          onSubmit={handleSearch}
          className="flex h-11 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#f90] transition-all"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 text-black outline-none placeholder-gray-500 text-base"
            placeholder="Search AmaZon.in"
          />
          <button
            type="submit"
            className="bg-[#febd69] px-4 flex items-center justify-center"
          >
            <Search className="h-6 w-6 text-gray-800" />
          </button>
        </form>

        {/* Mobile Suggestions Dropdown */}
        {search.trim() && (categories.some(c => c.name.toLowerCase().includes(search.toLowerCase())) || productSuggestions.length > 0) && (
          <div className="absolute top-12 left-2 right-2 bg-white border border-gray-200 shadow-2xl rounded-md z-[60] overflow-hidden">
            <ul className="text-black text-sm">
              {/* Categories */}
              {categories
                .filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()))
                .map(cat => (
                  <li 
                    key={cat.id}
                    onClick={() => {
                        router.push(`/?categoryId=${cat.id}`);
                        setSearch("");
                        setCategoryId(cat.id);
                    }}
                    className="px-4 py-3 active:bg-gray-100 border-b border-gray-50 flex items-center gap-3"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">in</span>
                    <span className="font-bold text-base">{cat.name}</span>
                  </li>
                ))}

              {/* Products */}
              {productSuggestions.map(product => (
                <li 
                  key={product.id} 
                  onClick={() => {
                    router.push(`/product/${product.id}`);
                    setSearch("");
                  }}
                  className="px-4 py-3 active:bg-gray-100 border-b border-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Search className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate text-base">{product.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
                </li>
              ))}

              {isLoadingSuggestions && productSuggestions.length === 0 && (
                 <li className="px-4 py-4 text-gray-400 italic text-center">Loading...</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* ═══ Sub Navbar ═══ */}
      <div className="bg-[#232f3e] px-2 md:px-4 py-1 flex items-center gap-2 md:gap-4 text-[13px] md:text-sm font-medium overflow-x-auto no-scrollbar whitespace-nowrap min-h-[40px]">
        {/* All Button (Desktop only) */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="hidden md:flex items-center gap-1 border border-transparent hover:border-white p-1 px-1.5 rounded-sm shrink-0"
        >
          <Menu className="h-5 w-5" />
          All
        </button>

        {/* Deliver To (Mobile version - ONLY thing on mobile subnav) */}
        <div className="flex md:hidden items-center gap-1 px-1 py-0.5 border border-transparent text-white shrink-0 w-full">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-normal">Delivering to New York 10001</span>
        </div>

        {/* Other Items (Desktop only) */}
        <span className="hidden md:inline-block cursor-pointer p-1 px-1.5 border border-transparent hover:border-white rounded-sm">Today's Deals</span>
        <span className="hidden md:inline-block cursor-pointer p-1 px-1.5 border border-transparent hover:border-white rounded-sm">Customer Service</span>
        <span className="hidden lg:inline-block cursor-pointer p-1 px-1.5 border border-transparent hover:border-white rounded-sm">Registry</span>
        <span className="hidden lg:inline-block cursor-pointer p-1 px-1.5 border border-transparent hover:border-white rounded-sm">Gift Cards</span>
        <span className="hidden xl:inline-block cursor-pointer p-1 px-1.5 border border-transparent hover:border-white rounded-sm">Sell</span>
      </div>

      {/* ═══ Sidebar Menu (Amazon India Style) ═══ */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 ${isSidebarOpen ? "visible" : "invisible"}`}
        aria-hidden={!isSidebarOpen}
      >
        {/* Dark Overlay */}
        <div
          className={`absolute inset-0 bg-black/80 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar Content */}
        <div className={`absolute top-0 left-0 bottom-0 w-[80%] max-w-[365px] bg-white transition-transform duration-300 text-black flex flex-col shadow-2xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {/* Header */}
          <div className="bg-[#232f3e] text-white p-4 flex items-center gap-3 shrink-0">
            <User className="h-7 w-7 bg-white rounded-full p-0.5 text-[#232f3e]" />
            <span className="text-lg font-bold">Hello, {session ? session.user.name.split(' ')[0] : "Sign in"}</span>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto pb-8">
            {/* Section: Trending */}
            <div className="border-b border-gray-200 py-3">
              <h3 className="px-6 py-2 text-lg font-bold">Trending</h3>
              <ul className="text-sm">
                <li 
                  onClick={() => { router.push('/'); setIsSidebarOpen(false); }}
                  className="px-6 py-3 hover:bg-gray-100 cursor-pointer group"
                >
                  <span className="group-hover:translate-x-1 transition-transform block">Bestsellers</span>
                </li>
                <li 
                  onClick={() => { router.push('/'); setIsSidebarOpen(false); }}
                  className="px-6 py-3 hover:bg-gray-100 cursor-pointer group"
                >
                  <span className="group-hover:translate-x-1 transition-transform block">New Releases</span>
                </li>
                <li 
                  onClick={() => { router.push('/'); setIsSidebarOpen(false); }}
                  className="px-6 py-3 hover:bg-gray-100 cursor-pointer group"
                >
                  <span className="group-hover:translate-x-1 transition-transform block">Movers and Shakers</span>
                </li>
              </ul>
            </div>

            {/* Section: Digital Content and Devices */}
            <div className="border-b border-gray-200 py-3">
              <h3 className="px-6 py-2 text-lg font-bold">Digital Content and Devices</h3>
              <ul className="text-sm">
                <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                  Echo & Alexa <Menu className="rotate-90 h-4 w-4 text-gray-500" />
                </li>
                <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                  Fire TV <Menu className="rotate-90 h-4 w-4 text-gray-500" />
                </li>
                <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                  Kindle E-Readers & eBooks <Menu className="rotate-90 h-4 w-4 text-gray-500" />
                </li>
                <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                  Audible Audiobooks <Menu className="rotate-90 h-4 w-4 text-gray-500" />
                </li>
              </ul>
            </div>

            {/* Section: Shop by Category */}
            <div className="py-3 border-b border-gray-200">
              <h3 className="px-6 py-2 text-lg font-bold">Shop by Category</h3>
              <ul className="text-sm">
                {categories.map((cat) => (
                  <li 
                    key={cat.id} 
                    onClick={() => {
                      router.push(`/?categoryId=${cat.id}`);
                      setIsSidebarOpen(false);
                    }}
                    className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                    <Menu className="rotate-90 h-4 w-4 text-gray-500" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Section: Help & Settings */}
            <div className="py-3">
               <h3 className="px-6 py-2 text-lg font-bold">Help & Settings</h3>
               <ul className="text-sm">
                 <li 
                   onClick={() => { router.push('/orders'); setIsSidebarOpen(false); }}
                   className="px-6 py-3 hover:bg-gray-100 cursor-pointer"
                 >
                   Your Account
                 </li>
                 <li className="px-6 py-3 hover:bg-gray-100 cursor-pointer">
                   Customer Service
                 </li>
                 {session ? (
                   <li 
                     onClick={handleLogout}
                     className="px-6 py-3 hover:bg-gray-100 cursor-pointer font-medium text-red-600 hover:text-red-700"
                   >
                     Sign Out
                   </li>
                 ) : (
                   <li 
                     onClick={() => { router.push('/login'); setIsSidebarOpen(false); }}
                     className="px-6 py-3 hover:bg-gray-100 cursor-pointer"
                   >
                     Sign In
                   </li>
                 )}
               </ul>
            </div>
          </div>
        </div>

        {/* Close Button */}
        {isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-2 left-[82%] md:left-[380px] text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <span className="text-3xl font-light">×</span>
          </button>
        )}
      </div>
    </header>
  );
};

