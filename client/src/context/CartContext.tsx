import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "../types";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("app_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("app_cart", JSON.stringify(items));
  }, [items]);

  //   add to cart function
  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item.product._id === product._id,
      );
      if (existingItem) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  //   remove from cart function
  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId));
  };

  //   update quantity function
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  //   clear cart function
  const clearCart = () => {
    setItems([]);
    setIsCartOpen(false);
  };

  //   cart count
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  //   cart total
  const cartTotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
