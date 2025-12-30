import type { AddressData, AddressErrors } from '../components/AddressForm';

export const validateAddress = (address: AddressData, type: 'billing' | 'shipping'): AddressErrors => {
  const errors: AddressErrors = {};

  // Common validations for both addresses
  if (!address.street?.trim()) {
    errors.street = 'Street address is required';
  }

  if (!address.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!address.state?.trim()) {
    errors.state = 'State is required';
  }

  if (!address.country?.trim()) {
    errors.country = 'Country is required';
  }

  if (!address.zipCode?.trim()) {
    errors.zipCode = 'ZIP code is required';
  } else if (!/^\d{5,6}(-\d{4})?$/.test(address.zipCode)) {
    errors.zipCode = 'Invalid ZIP code format';
  }

  if (!address.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(address.phone.replace(/\s/g, ''))) {
    errors.phone = 'Invalid phone number';
  }

  // Billing-specific validations
  if (type === 'billing') {
    if (!address.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!address.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!address.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      errors.email = 'Invalid email address';
    }
  }

  return errors;
};

export const validateCheckout = (
  billingAddress: AddressData,
  shippingAddress: AddressData,
  sameAddress: boolean
): { isValid: boolean; billingErrors: AddressErrors; shippingErrors: AddressErrors } => {
  const billingErrors = validateAddress(billingAddress, 'billing');
  const shippingErrors = sameAddress ? {} : validateAddress(shippingAddress, 'shipping');

  const isValid = 
    Object.keys(billingErrors).length === 0 && 
    Object.keys(shippingErrors).length === 0;

  return {
    isValid,
    billingErrors,
    shippingErrors
  };
};