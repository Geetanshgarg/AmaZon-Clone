"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "../components/layout/Navbar";
import { FilterSidebar } from "../components/filter/FilterSidebar";
import { ProductGrid } from "../components/product/ProductGrid";
import { HomeLanding } from "../components/home/HomeLanding";
import { Footer } from "../components/layout/Footer";
import { ProductService, type ProductFilters } from "../services/api";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-20">Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSearchActive = !!(searchParams.get("search") || searchParams.get("categoryId"));
  const search = searchParams.get("search");
  const categoryIdParam = searchParams.get("categoryId");

  // Filter state
  const [filters, setFilters] = useState<ProductFilters>({
    limit: 20,
    page: 1,
    search: search || undefined,
    categoryId: categoryIdParam || undefined,
  });

  // Update filters when URL changes
  useEffect(() => {
    setFilters((prev) => ({ 
      ...prev, 
      search: search || undefined, 
      categoryId: categoryIdParam || undefined,
      page: 1 
    }));
  }, [search, categoryIdParam]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ProductService.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever filters change
  const fetchProducts = useCallback(async () => {
    if (!isSearchActive) return; // Don't fetch grid products on landing page
    
    setLoading(true);
    setError(null);
    try {
      const res = await ProductService.getProducts(filters);
      setProducts(res.data);
      setTotalResults(res.metadata?.total || res.data.length);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [filters, isSearchActive]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (partial: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }));
  };

  const setSort = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  // Derive result text
  const resultLabel = filters.search
    ? `"${filters.search}"`
    : filters.categoryId
      ? `"${categories.find((c: any) => c.id === filters.categoryId)?.name || "category"}"`
      : '"All Products"';

  return (
    <div className="flex flex-col min-h-screen bg-[#e3e6e6]">
      <Navbar />

      {!isSearchActive ? (
        /* 🎨 Home Landing Page (Full Storefront) */
        <HomeLanding categories={categories} />
      ) : (
        /* 🔍 Search Results Page */
        <>
          {/* Results bar */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-[1500px] mx-auto w-full px-4 py-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    1-{products.length} of over{" "}
                    <span className="text-[#c45500] font-bold">{totalResults.toLocaleString()}</span>{" "}
                    results for <span className="text-[#c45500] font-bold">{resultLabel}</span>
                  </>
                )}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 hidden sm:inline">Sort by:</span>
                <select
                  value={filters.sortBy || ""}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-gray-100 border border-gray-300 rounded-lg shadow-sm py-1.5 px-3 text-sm focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none cursor-pointer"
                >
                  <option value="">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          <main className="flex flex-1 max-w-[1500px] mx-auto w-full">
            <FilterSidebar
              categories={categories}
              activeCategory={filters.categoryId || null}
              activePriceRange={
                filters.minPrice !== undefined || filters.maxPrice !== undefined
                  ? { min: filters.minPrice, max: filters.maxPrice }
                  : null
              }
              onCategoryChange={(categoryId) =>
                updateFilter({ categoryId: categoryId || undefined })
              }
              onPriceRangeChange={(min, max) =>
                updateFilter({ minPrice: min, maxPrice: max })
              }
              onClearFilters={() => {
                setFilters({ limit: 20, page: 1 });
                router.push("/");
              }}
            />

            {/* Product Grid Area */}
            <section className="flex-1 min-w-0 bg-white">
              <ProductGrid
                products={products}
                loading={loading}
                error={error}
              />
            </section>
          </main>
        </>
      )}
      <Footer />
    </div>
  );
}
