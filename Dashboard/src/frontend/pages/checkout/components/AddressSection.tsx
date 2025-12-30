import { useEffect } from "react";
import AddressForm from "./AddressForm";
import type { AddressData, AddressErrors } from "./AddressForm";
import SameAddressCheckbox from "./SameAddressCheckbox";

interface Props {
  billingAddress: AddressData;
  shippingAddress: AddressData;
  onBillingChange: (a: AddressData) => void;
  onShippingChange: (a: AddressData) => void;
  billingErrors: AddressErrors;
  shippingErrors: AddressErrors;
  sameAsBilling: boolean;
  setSameAsBilling: (v: boolean) => void;
  userEmail?: string;
}

const AddressSection = ({
  billingAddress,
  shippingAddress,
  onBillingChange,
  onShippingChange,
  billingErrors,
  shippingErrors,
  sameAsBilling,
  setSameAsBilling,
  userEmail
}: Props) => {
  useEffect(() => {
    if (userEmail && !billingAddress.email) {
      onBillingChange({ ...billingAddress, email: userEmail });
    }
  }, [userEmail]);

  useEffect(() => {
    if (sameAsBilling) {
      const { email, firstName, lastName, ...rest } = billingAddress;
      onShippingChange(rest);
    }
  }, [sameAsBilling, billingAddress]);

  const handleBillingChange = (data: AddressData) => {
    onBillingChange(data);
    if (sameAsBilling) {
      const { email, firstName, lastName, ...rest } = data;
      onShippingChange(rest);
    }
  };

  return (
    <>
      <AddressForm
        type="billing"
        address={billingAddress}
        onChange={handleBillingChange}
        errors={billingErrors}
      />

      <SameAddressCheckbox
        checked={sameAsBilling}
        onChange={setSameAsBilling}
      />

      {!sameAsBilling && (
        <AddressForm
          type="shipping"
          address={shippingAddress}
          onChange={onShippingChange}
          errors={shippingErrors}
        />
      )}
    </>
  );
};

export default AddressSection;
export type { AddressData };
