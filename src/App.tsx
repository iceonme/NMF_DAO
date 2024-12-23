import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import QuestionDetail from './pages/QuestionDetail';
import ResearchDetail from './pages/ResearchDetail';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/Toaster';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/research/:id" element={<ResearchDetail />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;