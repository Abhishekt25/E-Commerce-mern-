interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  stockFilter: string;
  onStockFilterChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

const Filters = ({
  searchTerm,
  onSearchChange,
  stockFilter,
  onStockFilterChange,
  itemsPerPage,
  onItemsPerPageChange,
}: FiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search products by name, SKU, or slug..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <select 
        value={stockFilter}
        onChange={(e) => onStockFilterChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">All stock status</option>
        <option value="in_stock">In stock</option>
        <option value="out_of_stock">Out of stock</option>
        <option value="low_stock">Low stock</option>
      </select>
      
      <select 
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="5">5 per page</option>
        <option value="10">10 per page</option>
        <option value="20">20 per page</option>
        <option value="50">50 per page</option>
      </select>
    </div>
  );
};

export default Filters;