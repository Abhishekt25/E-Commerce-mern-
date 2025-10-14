import { useState } from 'react';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    product: '',
    sku: '',
    stock: '',
    price: '',
    status: 'In Stock',
    variants: '',
    marketplaces: {
      amazon: false,
      flipkart: false,
    },
  });

  const [image, setImage] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const { name, value, type } = target;

      if (type === 'checkbox') {
        const checked = target.checked;
        setFormData((prev) => ({
          ...prev,
          marketplaces: {
            ...prev.marketplaces,
            [name]: checked,
          },
        }));
      } else if (type === 'file') {
        const file = target.files?.[0];
        if (file) setImage(file);
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (target instanceof HTMLSelectElement) {
      const { name, value } = target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formPayload = new FormData();
  formPayload.append('product', formData.product);
  formPayload.append('sku', formData.sku);
  formPayload.append('stock', formData.stock);
  formPayload.append('price', formData.price);
  formPayload.append('status', formData.status);
  formPayload.append('variants', formData.variants);
  formPayload.append('marketplaces', JSON.stringify(formData.marketplaces));
  if (image) formPayload.append('image', image);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
      method: 'POST',
      credentials: 'include',
      body: formPayload,
    });

    console.log('Response status:', response.status);

    // Try reading response as text first (for debugging)
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { message: 'Invalid JSON response from server' };
    }

    if (response.ok) {
      alert('Product Added');
      setFormData({
        product: '',
        sku: '',
        stock: '',
        price: '',
        status: 'In Stock',
        variants: '',
        marketplaces: { amazon: false, flipkart: false },
      });
      setImage(null);

      const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } else {
      alert(`Error: ${result.message}`);
    }

  } catch (err) {
    console.error('Error submitting form:', err);
    alert('Error adding product');
  }
};


  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow max-w-lg space-y-4">
      <h2 className="text-xl font-bold">Add Product</h2>

      <input name="product" value={formData.product} onChange={handleChange} placeholder="Product Name" className="w-full p-2 border rounded" />

      <input name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU" className="w-full p-2 border rounded" />

      <input name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" type="number" className="w-full p-2 border rounded" />

      <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" />

      <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="In Stock">In Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>

      <input name="variants" value={formData.variants} onChange={handleChange} placeholder="Variants (comma separated)" className="w-full p-2 border rounded" />

      <input type="file" accept="image/*" name="image" onChange={handleChange} className="w-full p-2 border rounded" />

      <div className="space-x-4">
        <label>
          <input type="checkbox" name="amazon" checked={formData.marketplaces.amazon} onChange={handleChange} /> Amazon
        </label>
        <label>
          <input type="checkbox" name="flipkart" checked={formData.marketplaces.flipkart} onChange={handleChange} /> Flipkart
        </label>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Product</button>
    </form>
  );
};

export default AddProduct;
