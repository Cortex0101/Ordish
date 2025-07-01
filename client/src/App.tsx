import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import { Spinner, Container } from 'react-bootstrap';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/home/Home'));
const About = lazy(() => import('./pages/about/About'));
const SignUp = lazy(() => import('./pages/login/SignUp'));
const Login = lazy(() => import('./pages/login/Login'));
const Profile = lazy(() => import('./pages/profile/Profile'));

// Games
const SpellingBee = lazy(() => import('./pages/spelling-bee/SpellingBee'));

// Loading component
const LoadingSpinner = () => (
  <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </Container>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />

            {/* Games */}
            <Route path="/spelling-bee" element={<SpellingBee />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;