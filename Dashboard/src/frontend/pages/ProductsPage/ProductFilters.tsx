import React from "react";

interface Filters {
  categories: string[];
  sort: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  categories: string[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const DEFAULT_FILTERS: Filters = {
  categories: [],
  sort: "",
  minPrice: "",
  maxPrice: "",
  inStockOnly: false,
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  filters,
  setFilters,
}) => {
  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const isFilterActive =
    filters.categories.length > 0 ||
    filters.sort !== "" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.inStockOnly;

  return (
    <div className="w-64 bg-white p-4 rounded-xl shadow-md h-fit sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>

        {/* CLEAR ALL BUTTON */}
        <button
          onClick={clearAllFilters}
          disabled={!isFilterActive}
          className="text-sm text-red-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Clear All
        </button>
      </div>

      {/* CATEGORY FILTER */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Category</h3>
        {categories.length === 0 && (
          <p className="text-sm text-gray-500">
            No categories found
          </p>
        )}
        {categories.map((category) => (
          <label key={category} className="block text-sm mb-1">
            <input
              type="checkbox"
              className="mr-2"
              checked={filters.categories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
            {category}
          </label>
        ))}
      </div>

      {/* SORT */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Sort By</h3>
        <select
          value={filters.sort}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              sort: e.target.value,
            }))
          }
          className="w-full border rounded-md p-2"
        >
          <option value="">Select</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
        </select>
      </div>

      {/* PRICE RANGE */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minPrice: e.target.value,
              }))
            }
            className="w-full border rounded-md p-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                maxPrice: e.target.value,
              }))
            }
            className="w-full border rounded-md p-2"
          />
        </div>
      </div>

      {/* STOCK */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              inStockOnly: e.target.checked,
            }))
          }
        />
        In Stock Only
      </label>
    </div>
  );
};

export default ProductFilters;
