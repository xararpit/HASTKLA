import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './hastkla.css';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Navigate to="/shop" replace />} />
        <Route path="/shop"        element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        {/* Add more routes here: /login, /register, /dashboard, /admin */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
