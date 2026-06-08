import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import type { Product } from "../types";
import { dummyProducts } from "../assets/assets";
import Loading from "../components/Loading";
import {
  ArrowLeftIcon,
  HomeIcon,
  LeafIcon,
  StarIcon,
  StarHalfIcon,
  CheckIcon,
  XIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  ArrowRightIcon,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import DummyReviewsSection from "../assets/DummyReviewsSection";

const ProductPage = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [localQuantity, setLocalQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setLocalQuantity(1);
    window.scrollTo(0, 0);
    const product = dummyProducts.find((p) => p._id === id);
    setProduct(product);
    setRelatedProducts(dummyProducts.filter((p) => p._id !== id));
    setLoading(false);
  }, [id, navigate]);

  if (loading) return <Loading />;
  if (!product) return null;
  const cartItem = items.find((item) => item.product._id === product._id);
  const inCart = !!cartItem;
  const displayQuantity = inCart ? cartItem.quantity : localQuantity;

  const categoryLabel = product.category.replace(/-/g, " ");
  const handleMinus = () => {
    if (inCart) {
      if (cartItem.quantity > 1)
        updateQuantity(product._id, cartItem.quantity - 1);
      else removeFromCart(product._id);
    } else {
      setLocalQuantity(Math.max(1, localQuantity - 1));
    }
  };
  const handlePlus = () => {
    if (inCart) {
      updateQuantity(product._id, cartItem.quantity + 1);
    } else {
      setLocalQuantity(localQuantity + 1);
    }
  };
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
          <Link to="/" className="hover:text-app-green transition-colors">
            <HomeIcon className="size-4" />
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-app-green transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-app-green transition-colors capitalize"
          >
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-app-green font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm text-app-text-light hover:text-app-green transition-colors"
        >
          <ArrowLeftIcon className="size-4" /> Back
        </button>
        {/* Product Details Section */}
        <div className="bg-white/50 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* left side - Image */}
            <div className="relative flex-center p-8 md:p-12 min-h-[320px] md:min-h-[480px]">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[360px] w-auto object-contain"
              />
              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
                {product.isOrganic && (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-app-green text-white rounded-full">
                    <LeafIcon className="w-3 h-3" /> Organic
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="px-2.5 py-1 text-xs font-semibold bg-app-orange text-white rounded-full">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* right side - Details */}
            <div className="p-6 sm:p-10 flex flex-col justify-center">
              <span className="text-xs font-medium text-app-text-light tracking-wider mb-2 capitalize">
                {categoryLabel}
              </span>
              <h1 className="text-2xl md:text-3xl font-semibold text-app-green mb-3">
                {product.name}
              </h1>

              {/* rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFull = star <= Math.floor(product.rating);
                      const isHalf =
                        !isFull &&
                        star <= Math.ceil(product.rating) &&
                        product.rating % 1 !== 0;

                      if (isFull) {
                        return (
                          <StarIcon
                            key={star}
                            className="size-5 fill-yellow-400 text-yellow-400"
                          />
                        );
                      } else if (isHalf) {
                        return (
                          <StarHalfIcon
                            key={star}
                            className="size-5 fill-yellow-400 text-yellow-400"
                          />
                        );
                      } else {
                        return (
                          <StarIcon
                            key={star}
                            className="size-5 text-gray-400"
                          />
                        );
                      }
                    })}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-app-text-light">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-app-green">
                    {currency}
                    {product.price.toFixed(2)}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-xl text-app-text-light line-through">
                        {currency}
                        {product.originalPrice.toFixed(2)}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-semibold bg-app-orange text-white rounded">
                        {product.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                {/* Description */}
                <p className="text-sm text-app-text-light leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Stock */}
                <div className="mb-6">
                  {product.stock > 0 ? (
                    <span className="text-sm flex items-center gap-1 text-app-success font-medium">
                      <CheckIcon className="size-4" /> In Stock ({product.stock}{" "}
                      available)
                    </span>
                  ) : (
                    <span className="text-sm flex items-center gap-1 text-app-error font-medium">
                      <XIcon className="size-4" /> Out of Stock
                    </span>
                  )}
                </div>
                {/* Quantity + Add to Cart */}
                <div className="flex items-center gap-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMinus()}
                      className="size-8 flex-center rounded-full border border-app-border text-app-text-light hover:bg-app-border transition-colors"
                    >
                      <MinusIcon className="size-4" />
                    </button>
                    <span className="w-10 text-center text-lg font-medium">
                      {displayQuantity}
                    </span>
                    <button
                      onClick={() => handlePlus()}
                      className="size-8 flex-center rounded-full border border-app-border text-app-text-light hover:bg-app-border transition-colors"
                    >
                      <PlusIcon className="size-4" />
                    </button>
                  </div>
                  {/* Add to Cart */}
                  <button
                    onClick={() => {
                      if (!inCart) addToCart(product, localQuantity);
                    }}
                    disabled={product.stock === 0}
                    className={`flex-1 py-3 font-semibold rounded-xl transition-colors flex-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${inCart ? "bg-app-cream text-app-green border border-app-green" : "bg-app-orange text-white hover:bg-orange-dark"}`}
                  >
                    <ShoppingCartIcon className="size-4" />
                    <span className="font-medium">
                      {inCart ? "Added to Cart" : "Add to Cart"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Customer Reviews Section */}
        {product.reviewCount > 0 && <DummyReviewsSection product={product} />}

        {/* Related Products  */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 mb-44">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-app-green">
                  Related Products
                </h2>
                <p className="text-sm text-app-text-light mt-1">
                  More from {categoryLabel}
                </p>
              </div>
              <Link
                className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors"
                to={`/products?category=${product.category}`}
              >
                View All <ArrowRightIcon className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
              {relatedProducts.slice(0, 5).map((rp) => (
                <ProductCard key={rp._id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
