import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  product: string;
  sku: string;
  stock: number;
  price: number;
  categories: string[];
  description: string;
  shortDescription: string;
  tags: string[];
  image?: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [addedProduct, setAddedProduct] = useState<any>(null);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    };
    fetchProduct();
  }, [id, API_BASE_URL]);

  // Fetch related products
  useEffect(() => {
    if (!product) return;

    const fetchRelated = async () => {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();

      const related = data.filter((p: Product) =>
        p._id !== product._id &&
        p.categories.some(cat => product.categories.includes(cat))
      );

      setRelatedProducts(related.slice(0, 4));
    };

    fetchRelated();
  }, [product, API_BASE_URL]);

  // Add to cart
    const handleAddToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i: any) => i._id === product._id);

    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({
        _id: product._id,
        name: product.product,
        price: product.price,
        quantity: qty,
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    setAddedProduct({
        name: product.product,
        price: product.price,
    });

    // ✅ AUTO HIDE AFTER 5 SECONDS
    setTimeout(() => {
        setAddedProduct(null);
    }, 5000);
    };

  const handleViewCart = () => {
    navigate("/cart");
  };

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* ADDED TO CART MESSAGE */}
      {addedProduct && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>
            🛒 <strong>{addedProduct.name}</strong> (₹{addedProduct.price})
          </span>
          <button
            onClick={handleViewCart}
            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
          >
            View Cart
          </button>
        </div>
      )}

      {/* PRODUCT TOP */}
      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={`${API_BASE_URL}/uploads/${product.image}`}
          alt={product.product}
          className="rounded-xl w-full max-h-[420px] object-contain"
        />

        <div>
          <h1 className="text-3xl font-bold">{product.product}</h1>

          {/* SKU INSTEAD OF PRODUCT ID */}
          <p className="text-sm text-gray-500 mt-1">
            SKU: {product.sku}
          </p>

          <p className="text-2xl font-semibold mt-4">
            ₹{product.price}
          </p>

          {/* QUANTITY */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-3 py-1 border rounded"
            >
              −
            </button>

            <span className="font-semibold">{qty}</span>

            <button
              onClick={() => setQty(qty + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`mt-4 px-6 py-3 rounded-lg text-white ${
              product.stock > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>

          {/* SHORT DESCRIPTION BELOW ADD TO CART */}
          {product.shortDescription && (
            <p className="mt-4 text-gray-700">
              {product.shortDescription}
            </p>
          )}

          {/* CATEGORIES & TAGS BELOW SHORT DESCRIPTION */}
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p>
              <strong>Categories:</strong> {product.categories.join(", ")}
            </p>
            <p>
              <strong>Tags:</strong> {product.tags.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* FULL DESCRIPTION (UNCHANGED) */}
      {product.description && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-2">Description</h2>
          <p className="text-gray-700">{product.description}</p>
        </div>
      )}

      {/* RELATED PRODUCTS (UNCHANGED) */}
        {relatedProducts.length > 0 && (
        <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
                <div
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                className="border rounded-lg p-3 cursor-pointer hover:shadow-lg transition"
                >
                <img
                    src={`${API_BASE_URL}/uploads/${p.image}`}
                    alt={p.product}
                    className="h-40 w-full object-cover rounded"
                />

                <p className="mt-2 font-semibold">{p.product}</p>
                <p className="text-sm mb-2">₹{p.price}</p>

                {/* ADD TO CART BUTTON */}
                <button
                    onClick={(e) => {
                    e.stopPropagation(); // prevent navigation
                    
                    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                    const existing = cart.find((item: any) => item._id === p._id);

                    if (existing) {
                        existing.quantity += 1;
                    } else {
                        cart.push({
                        _id: p._id,
                        name: p.product,
                        price: p.price,
                        quantity: 1,
                        });
                    }

                    localStorage.setItem("cart", JSON.stringify(cart));
                    window.dispatchEvent(new Event("cartUpdated"));
                    }}
                    className="w-full  text-white py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition"
                >
                    Add to Cart
                </button>
                </div>
            ))}
            </div>
        </div>
        )}

    </div>
  );
};

export default ProductDetails;
