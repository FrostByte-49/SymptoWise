import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';

import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { HealthDataProvider } from './contexts/HealthDataContext';
import { ToastProvider } from './components/ui/ToastProvider';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import FunZonePage from './pages/FunZonePage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import RoutineGeneratorPage from './pages/RoutineGeneratorPage';
import ConsultDoctorPage from './pages/ConsultDoctor';
import ExercisePage from './pages/ExercisePage';
import DietPage from './pages/DietPage';
import SkincareSection from './pages/SkincareSection';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';

// Initialize GA4
ReactGA.initialize('G-JEN661EFN8');

// Component To Track Page Views
// eslint-disable-next-line react-refresh/only-export-components
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ 
      hitType: "pageview", 
      page: location.pathname + location.search 
    });
  }, [location]);

  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <ThemeProvider>
        <HealthDataProvider>
          <ToastProvider>
            {/* Add RouteTracker inside Router but outside Routes */}
            <RouteTracker />
            <Routes>
              {/* Routes wrapped with Sidebar + Header */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <MainLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<HomePage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="fun-zone" element={<FunZonePage />} />
                <Route path="symptom-checker" element={<SymptomCheckerPage />} />
                <Route path="routine-generator" element={<RoutineGeneratorPage />} />
                <Route path="exercises" element={<ExercisePage />} />
                <Route path="diet-page" element={<DietPage />} />
                <Route path="skincare" element={<SkincareSection />} />
                <Route path="consult-doctor" element={<ConsultDoctorPage />} />
              </Route>

              {/* Auth or non-layout pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ToastProvider>
        </HealthDataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);