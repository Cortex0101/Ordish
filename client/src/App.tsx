import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/home/Home';
import SignUp from './pages/login/SignUp';
import Profile from './pages/profile/Profile';
import Header from './components/Header/Header';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;