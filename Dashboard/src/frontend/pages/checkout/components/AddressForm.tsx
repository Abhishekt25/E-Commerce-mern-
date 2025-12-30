import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';

// Export interfaces
export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface AddressErrors {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface AddressFormProps {
  type: 'billing' | 'shipping';
  address: AddressData;
  onChange: (address: AddressData) => void;
  errors: AddressErrors;
}

const AddressForm: React.FC<AddressFormProps> = ({ 
  type, 
  address, 
  onChange, 
  errors 
}) => {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Load countries on component mount
  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (address.country) {
      const countryCode = countries.find(c => c.name === address.country)?.isoCode;
      if (countryCode) {
        const stateList = State.getStatesOfCountry(countryCode);
        setStates(stateList);
      } else {
        setStates([]);
      }
      setCities([]);
    }
  }, [address.country, countries]);

  // Load cities when state changes
  useEffect(() => {
    if (address.country && address.state) {
      const countryCode = countries.find(c => c.name === address.country)?.isoCode;
      const stateCode = states.find(s => s.name === address.state)?.isoCode;
      
      if (countryCode && stateCode) {
        const cityList = City.getCitiesOfState(countryCode, stateCode);
        setCities(cityList);
      } else {
        setCities([]);
      }
    }
  }, [address.state, address.country, countries, states]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'country') {
      onChange({
        ...address,
        country: value,
        state: '',
        city: ''
      });
    } else if (name === 'state') {
      onChange({
        ...address,
        state: value,
        city: ''
      });
    } else {
      onChange({
        ...address,
        [name]: value
      });
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 capitalize">{type} Address</h2>
      
      <form className="space-y-4">
        {/* Name Fields - only for billing */}
        {type === 'billing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                className={`w-full border p-3 rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="First Name"
                name="firstName"
                value={address.firstName || ''}
                onChange={handleChange}
                required
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            
            <div>
              <input
                className={`w-full border p-3 rounded-lg ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Last Name"
                name="lastName"
                value={address.lastName || ''}
                onChange={handleChange}
                required
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>
        )}

        {/* Email - only for billing */}
        {type === 'billing' && (
          <div>
            <input
              className={`w-full border p-3 rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Email"
              type="email"
              name="email"
              value={address.email || ''}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        )}

        {/* Street Address */}
        <div>
          <input
            className={`w-full border p-3 rounded-lg ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Street Address"
            name="street"
            value={address.street}
            onChange={handleChange}
            required
          />
          {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
        </div>

        {/* Country Dropdown */}
        <div>
          <select
            className={`w-full border p-3 rounded-lg ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
            name="country"
            value={address.country}
            onChange={handleChange}
            required
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        {/* State and City Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* State Dropdown */}
          <div>
            <select
              className={`w-full border p-3 rounded-lg ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              name="state"
              value={address.state}
              onChange={handleChange}
              required
              disabled={!address.country}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>

          {/* City Dropdown */}
          <div>
            <select
              className={`w-full border p-3 rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              name="city"
              value={address.city}
              onChange={handleChange}
              required
              disabled={!address.state}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
        </div>

        {/* ZIP Code and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              className={`w-full border p-3 rounded-lg ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="ZIP/Postal Code"
              name="zipCode"
              value={address.zipCode}
              onChange={handleChange}
              required
            />
            {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
          </div>

          <div>
            <input
              className={`w-full border p-3 rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Phone Number"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>
      </form>
    </div>
  );
};

// Export as default
export default AddressForm;