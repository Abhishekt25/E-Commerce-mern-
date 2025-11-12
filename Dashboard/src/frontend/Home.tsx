import Banner from "./pages/Home-page/Banner";

const FrontendHome = () => {
  return (
    <div className="p-6">
      {/* Banner Component */}
      <Banner />

      <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
        Discover our premium skincare and wellness products designed to enhance your natural beauty and boost your confidence.
      </p>
    </div>
  );
};

export default FrontendHome;