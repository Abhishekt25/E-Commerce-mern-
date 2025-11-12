import Banner from "./pages/Home-page/Banner";
import BestProduct from "./pages/Home-page/Best-product";

const FrontendHome = () => {
  return (
    <div className="p-6">
      {/* Banner Component */}
      <Banner />

      <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
        Discover our premium skincare and wellness products designed to enhance your natural beauty and boost your confidence.
      </p>

      <BestProduct />
    </div>
  );
};

export default FrontendHome;
