import React from 'react';

interface SameAddressCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const SameAddressCheckbox: React.FC<SameAddressCheckboxProps> = ({ 
  checked, 
  onChange,
  disabled = false 
}) => {
  return (
    <div className="flex items-center mb-6 p-4 bg-blue-50 rounded-lg">
      <input
        type="checkbox"
        id="sameAddress"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
      />
      <label htmlFor="sameAddress" className="ml-3 text-gray-700">
        <span className="font-medium">Use same address for shipping</span>
        <p className="text-sm text-gray-600 mt-1">
          Check this box if your shipping address is the same as your billing address
        </p>
      </label>
    </div>
  );
};

export default SameAddressCheckbox;