import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage.jsx';
import OwnerPage from './pages/OwnerPage.jsx';
import { Provider } from 'react-redux';
import store from './redux/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/ownerPage" element={<OwnerPage />} />
          <Route path="/customerPage" element={<CustomerPage />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)



