import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductFilters from "./ProductFilters";

interface Product {
  _id: string;
  product: string;
  price: number;
  stock: number;
  categories: string[];
  sku?: string;
  image?: string;
}

interface Filters {
  categories: string[];
  sort: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [_cart, setCart] = useState<{ _id: string; quantity: number }[]>([]);
  const [addedProduct, setAddedProduct] = useState<{
    name: string;
    price: number;
  } | null>(null);
  const [showViewCart, setShowViewCart] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    categories: [],
    sort: "",
    minPrice: "",
    maxPrice: "",
    inStockOnly: false,
  });

  // 🔹 Mobile filter toggle
  const [showFilters, setShowFilters] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  /*  FETCH PRODUCTS  */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, [API_BASE_URL]);

  /* FILTER PRODUCTS */
  const filteredProducts = products
    .filter((p) => {
      if (
        filters.categories.length &&
        !p.categories.some((cat) => filters.categories.includes(cat))
      )
        return false;

      if (filters.inStockOnly && p.stock <= 0) return false;
      if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;

      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "az") return a.product.localeCompare(b.product);
      if (filters.sort === "za") return b.product.localeCompare(a.product);
      if (filters.sort === "priceLow") return a.price - b.price;
      if (filters.sort === "priceHigh") return b.price - a.price;
      return 0;
    });

  /*ADD TO CART  */
  const handleAddToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const item = existingCart.find((i: any) => i._id === product._id);

    if (item) item.quantity += 1;
    else existingCart.push({ _id: product._id, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);

    setAddedProduct({ name: product.product, price: product.price });
    setShowViewCart(product._id);

    setTimeout(() => setAddedProduct(null), 4000);
    setTimeout(() => setShowViewCart(null), 4000);
  };

  const allCategories = [
    ...new Set(products.flatMap((p) => p.categories)),
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      {/* SUCCESS MESSAGE */}
      {addedProduct && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg mb-4 flex justify-between">
          <span>
            🛒 {addedProduct.name} (₹{addedProduct.price})
          </span>
          <button
            onClick={() => navigate("/cart")}
            className="bg-green-600 text-white px-3 py-1 rounded-md"
          >
            View Cart
          </button>
        </div>
      )}

      {/* MOBILE FILTER BUTTON */}
      <button
        onClick={() => setShowFilters((prev) => !prev)}
        className="lg:hidden mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* FILTER SIDEBAR */}
        {(showFilters || window.innerWidth >= 1024) && (
          <ProductFilters
            categories={allCategories}
            filters={filters}
            setFilters={setFilters}
          />
        )}

        {/* PRODUCTS GRID */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Products
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="border rounded-2xl shadow-md p-4 bg-white cursor-pointer hover:shadow-lg"
              >
                {product.image && (
                  <img
                    src={`${API_BASE_URL}/uploads/${product.image}`}
                    alt={product.product}
                    className="h-40 mx-auto object-contain mb-3"
                  />
                )}

                <h2 className="font-medium line-clamp-1">
                  {product.product}
                </h2>
                <p className="text-gray-600">₹{product.price}</p>

                <p
                  className={`text-sm mt-1 ${
                    product.stock > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={product.stock <= 0}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl disabled:bg-gray-400"
                >
                  Add to Cart
                </button>

                {showViewCart === product._id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/cart");
                    }}
                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl"
                  >
                    View Cart
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
