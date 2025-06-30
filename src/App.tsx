import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import RoutineGeneratorPage from './pages/RoutineGeneratorPage';
import SkincareSection from './pages/SkincareSection';
import ConsultDoctorPage from './pages/ConsultDoctor';
import ExercisePage from './pages/ExercisePage';
import DietPage from './pages/DietPage'
import FunZonePage from './pages/FunZonePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage'; 


const App: React.FC = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected/Main Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="symptom-checker" element={<SymptomCheckerPage />} />
          <Route path="routine-generator" element={<RoutineGeneratorPage />} />
          <Route path="skincare" element={<SkincareSection />} />
          <Route path="consult-doctor" element={<ConsultDoctorPage />} />
          <Route path="exercises" element={<ExercisePage />} />
          <Route path="diet-page" element={<DietPage />} />
          <Route path="fun-zone" element={<FunZonePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;
