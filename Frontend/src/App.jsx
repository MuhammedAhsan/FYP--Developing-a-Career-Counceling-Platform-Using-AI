import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter, Navigate } from 'react-router-dom';
import ProfileForm from './pages/ProfileForm';
import LoginPage from './pages/LoginPage';
import CourseRecommendation from './pages/CourseRecommendation';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { Chatbot } from './components/Chatbot';
import { UserProvider } from './components/UserContext';
import { SkillGap } from './components/SkillGap';
import { useEffect } from 'react';
import { RecommendationProvider } from './components/RecommendationContext';

export default function App() {
  useEffect(() => {

  }, [])

  return (
    <UserProvider>
      <RecommendationProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Dashboard />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path='home' element={<Home />} />
              <Route path='chatbot' element={<Chatbot />} />
              <Route path='recommendation' element={<CourseRecommendation />} />
              <Route path='skillgap' element={<SkillGap />} />
            </Route>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/create-profile' element={<ProfileForm />} />
          </Routes>
        </BrowserRouter>
      </RecommendationProvider>
    </UserProvider>
  );
}