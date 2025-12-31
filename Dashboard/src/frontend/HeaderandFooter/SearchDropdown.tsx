import { Link } from "react-router-dom";

interface Product {
  _id: string;
  product: string;
  price: number;
  image?: string;
}

interface Props {
  products: Product[];
  visible: boolean;
  onSelect: () => void;
}


const SearchDropdown: React.FC<Props> = ({ products, visible, onSelect }) => {
  if (!visible || products.length === 0) return null;

  return (
    <div className="absolute top-full mt-2 w-full bg-white rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
      {products.map((item) => (
        <Link
        key={item._id}
        to={`/product/${item._id}`}
        onClick={onSelect}
        className="flex gap-3 p-3 hover:bg-gray-100 border-b"
        >

          <img
            src={
                item.image
                ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${item.image}`
                : "/placeholder.png"
            }
            alt={item.product}
            className="w-12 h-12 object-contain"
            />

          <div>
            <p className="text-sm font-medium text-gray-800">
              {item.product}
            </p>
            <p className="text-sm text-green-600 font-semibold">
              ₹{item.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchDropdown;
