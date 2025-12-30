import React, { useState, useEffect } from 'react';
import AddressForm, { type AddressData, type AddressErrors } from './AddressForm';
import SameAddressCheckbox from './SameAddressCheckbox';

interface AddressSectionProps {
  billingAddress: AddressData;
  shippingAddress: AddressData;
  onBillingChange: (address: AddressData) => void;
  onShippingChange: (address: AddressData) => void;
  billingErrors: AddressErrors;
  shippingErrors: AddressErrors;
  userEmail?: string;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  billingAddress,
  shippingAddress,
  onBillingChange,
  onShippingChange,
  billingErrors,
  shippingErrors,
  userEmail
}) => {
  const [sameAddress, setSameAddress] = useState(true);

  // Initialize billing address with user email if available
  useEffect(() => {
    if (userEmail && !billingAddress.email) {
      onBillingChange({
        ...billingAddress,
        email: userEmail
      });
    }
  }, [userEmail]);

  // Handle same address checkbox
  useEffect(() => {
    if (sameAddress) {
      // Copy billing address to shipping address (excluding email and name fields)
      const { email, firstName, lastName, ...shippingData } = billingAddress;
      onShippingChange({
        ...shippingData,
        email: '',
        firstName: '',
        lastName: ''
      });
    }
  }, [sameAddress, billingAddress]);

  const handleSameAddressChange = (checked: boolean) => {
    setSameAddress(checked);
  };

  const handleBillingChange = (address: AddressData) => {
    onBillingChange(address);
    
    // If same address is checked, update shipping too
    if (sameAddress) {
      const { email, firstName, lastName, ...shippingData } = address;
      onShippingChange({
        ...shippingData,
        email: '',
        firstName: '',
        lastName: ''
      });
    }
  };

  return (
    <div className="mb-8">
      {/* Billing Address */}
      <AddressForm
        type="billing"
        address={billingAddress}
        onChange={handleBillingChange}
        errors={billingErrors}
      />

      {/* Same Address Checkbox */}
      <SameAddressCheckbox
        checked={sameAddress}
        onChange={handleSameAddressChange}
      />

      {/* Shipping Address - Conditionally render if not same as billing */}
      {!sameAddress && (
        <AddressForm
          type="shipping"
          address={shippingAddress}
          onChange={onShippingChange}
          errors={shippingErrors}
        />
      )}
    </div>
  );
};

export default AddressSection;
// Export AddressData type for use in Checkout.tsx
export type { AddressData };