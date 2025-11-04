import { Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from '../admin/components/sidebar';
import Header from '../admin/components/Header';
import { lazy, Suspense, useState } from 'react';
import Loading from '../admin/components/Loading';
import { AdminRoute } from '../Router/AdminRoute';

const Home = lazy(() => import('../admin/Adminpages/Home'));
const Order = lazy(() => import('../admin/Adminpages/Order'));
const Inventory = lazy(() => import('../admin/Adminpages/Inventory'));
const Analytics = lazy(() => import('../admin/Adminpages/Analytics'));
const Setting = lazy(() => import('../admin/Adminpages/Setting'));

const AdminRouter = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AdminRoute>
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} w-full`}>
          <Header 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />
          <main className="mt-16 p-8">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path='' element={<Home />} />
                <Route path='orders' element={<Order />} />
                <Route path='inventory' element={<Inventory />} />
                <Route path='analytics' element={<Analytics />} />
                <Route path='setting' element={<Setting />} />
                {/* Redirect any unknown admin routes to home */}
                <Route path='*' element={<Navigate to="" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminRouter;