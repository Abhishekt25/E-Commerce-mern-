// src/Router/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loading from '../admin/components/Loading'; // reuse loading spinner

// Frontend
const FrontendHome = lazy(() => import('../frontend/Home'));

// Admin
const AdminRouter = lazy(() => import('./AdminRouter'));

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Frontend routes */}
          <Route path='/' element={<FrontendHome />} />

          {/* Admin routes */}
          <Route path='/admin/*' element={<AdminRouter />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
