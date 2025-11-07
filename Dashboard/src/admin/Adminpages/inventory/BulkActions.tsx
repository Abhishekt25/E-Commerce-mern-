interface BulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

const BulkActions = ({ selectedCount, onBulkAction }: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg mb-4">
      <span className="text-sm font-medium text-blue-900">
        {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <select 
        onChange={(e) => onBulkAction(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Bulk actions</option>
        <option value="trash">Move to trash</option>
      </select>
      <button 
        onClick={() => onBulkAction("trash")}
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Apply
      </button>
    </div>
  );
};

export default BulkActions;