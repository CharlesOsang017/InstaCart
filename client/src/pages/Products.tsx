import type { Product } from "../types";
import ProductCard from "../components/ProductCard";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { categoriesData, dummyProducts } from "../assets/assets";
import { ChevronDown, Home, SlidersHorizontal, XIcon } from "lucide-react";
import Loading from "../components/Loading";
import FilterPanel from "../components/FilterPanel";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const category = searchParams.get("category") || "";
  const organic = searchParams.get("organic") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const fetchProducts = async () => {
    setLoading(true);
    let filteredProducts = [...dummyProducts];

    // Category filter
    if (category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === category,
      );
    }

    // Organic filter
    if (organic === "true") {
      filteredProducts = filteredProducts.filter((p) => p.isOrganic);
    }

    // Price range filter
    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= Number(minPrice),
      );
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= Number(maxPrice),
      );
    }

    // Sorting logic
    switch (sort) {
      case "price_asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Newest (assuming createdAt exists and can be compared)
        filteredProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    setProducts(filteredProducts);
    setLoading(false);
  };

  // update filter
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== "page") {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  };

  // clear filters
  const clearFilters = () => {
    setSearchParams({});
  };

  // set active filters
  const activeCategory = categoriesData.find((c) => c.slug === category);
  // check if filters are available
  const hasFilters = category || organic || sort || minPrice || maxPrice;

  useEffect(() => {
    fetchProducts();
  }, [category, organic, sort, page, minPrice, maxPrice]);

  console.log("all Products", products);

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-app-text-light mb-6">
          <Link to="/" className="hover:text-app-green transition-colors">
            <Home />
          </Link>
          <span>/</span>
          <span className="text-app-green font-medium">
            {activeCategory ? activeCategory.name : "All Products"}
          </span>
        </nav>
        <div className="flex gap-8 xl:px-10">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-10">
            <div className="bg-white rounded-2xl p-4 sticky top-24">
              <FilterPanel
                categories={categoriesData}
                category={category}
                organic={organic}
                minPrice={minPrice}
                maxPrice={maxPrice}
                sort={sort}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                hasFilters={hasFilters}
              />
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1">
            {/*Header  */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-app-green">
                  {activeCategory ? activeCategory.name : "All Products"}
                </h1>
                <p className="text-sm text-app-text-light mt-0.5">
                  {products.length} products found
                </p>
              </div>
              <div className="flex flex-col lg:items-center gap-3">
                {/* mobile Filter toggle */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-xl border border-app-border hover:bg-app-cream transition-colors"
                >
                  <SlidersHorizontal className="size-4" /> Filters
                </button>
                {/* sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm bg-white rounded-xl border border-app-border focus:border-app-green outline-none cursor-pointer"
                  >
                    {/* <option value="">Sort by</option> */}
                    <option value="">Newest</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">Name: A → Z</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 text-app-text-light pointer-events-none" />
                </div>
              </div>
            </div>
            {/* Product Grid */}
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-semibold text-app-green mb-2">
                  No Products found
                </p>
                <p className="text-sm text-app-text-light mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2 text-sm font-medium bg-app-green text-white rounded-xl hover:bg-app-green-light transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  xl:gap-8  gap-4">
                {products.map(
                  (product) =>
                    product.stock > 0 && (
                      <ProductCard key={product._id} product={product} />
                    ),
                )}
              </div>
            )}

            {/* Pagination */}
            <div className="flex-center gap-2 mt-16">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => updateFilter("page", pageNum.toString())}
                    className={`size-10 rounded-xl font-medium transition-colors ${
                      page === pageNum
                        ? "bg-app-green text-white"
                        : "bg-white text-app-text hover:bg-app-cream"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>
          </main>
        </div>
      </div>
      {/* Mobile Filter */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-4 border-b border-app-border">
              <h3 className="text-lg font-semibold text-app-green">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-app-cream rounded-lg"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel
                categories={categoriesData}
                category={category}
                organic={organic}
                minPrice={minPrice}
                maxPrice={maxPrice}
                sort={sort}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                hasFilters={hasFilters}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
