export const generateSlug = (productName: string): string => {
  return productName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const getStockBadge = (stock: number): { text: string; class: string } => {
  if (stock === 0) return { text: "Out of stock", class: "bg-red-100 text-red-800" };
  if (stock < 10) return { text: "Low stock", class: "bg-yellow-100 text-yellow-800" };
  return { text: "In stock", class: "bg-green-100 text-green-800" };
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};