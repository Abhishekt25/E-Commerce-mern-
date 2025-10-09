import { lazy, useState } from "react";

const AddProduct = lazy(()=> import ("./AddProduct"));

const QuickActions = () => {

  const [showAddProduct, setShowAddProduct] =useState(false);


    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-[489px]">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <p className="text-gray-500 text-sm mb-4">Common tasks to manage your store</p>
        
        <div className="space-y-3">
          {/* Add Product Button */}
          <button  onClick={() => setShowAddProduct(!showAddProduct)} className="flex items-center w-full p-3 text-left rounded-md border border-dashed border-gray-300 hover:bg-blue-50 transition-colors">
            <span className="text-blue-500 text-xl mr-2">+</span>
            <span>{showAddProduct ? 'Close Product Form' : 'Add Product'}</span>
          </button>
           {/* Conditionally Render AddProduct */}
            {showAddProduct && <AddProduct />}
          
          {/* Sync Inventory Checkbox */}
          <label className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
            <input 
              type="checkbox" 
              className="form-checkbox h-4 w-4 text-blue-500 rounded mr-3"
              defaultChecked
            />
            <span className="font-medium">Sync Inventory</span>
          </label>
          
          {/* Create Promotion Checkbox */}
          <label className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
            <input 
              type="checkbox" 
              className="form-checkbox h-4 w-4 text-blue-500 rounded mr-3"
            />
            <span className="font-medium">Create Promotion</span>
          </label>
        </div>
      </div>
    );
  };
  
  export default QuickActions;