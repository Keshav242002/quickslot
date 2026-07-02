import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { VenueListPage } from '@/features/venues/pages/VenueListPage';
import { VenueDetailPage } from '@/features/booking/pages/VenueDetailPage';
import { MyBookingsPage } from '@/features/my-bookings/pages/MyBookingsPage';
import { NotFoundPage } from '@/shared/components/NotFoundPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/venues" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/venues"
          element={
            <ProtectedRoute>
              <VenueListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/venues/:venueId"
          element={
            <ProtectedRoute>
              <VenueDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
