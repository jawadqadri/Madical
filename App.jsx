import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import BrowseMedicines from './pages/BrowseMedicines';
import MedicineDetail from './pages/MedicineDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Categories from './pages/Categories';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import TrackOrder from './pages/TrackOrder';
import ReturnPolicy from './pages/ReturnPolicy';
import DeliveryPolicy from './pages/DeliveryPolicy';
import HelpCenter from './pages/HelpCenter';
import CookieSettings from './pages/CookieSettings';
import { UserRole } from './types';
// Component to scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);
    return null;
};
const App = () => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const handleAddToCart = (med) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === med.id);
            if (existing) {
                return prev.map(item => item.id === med.id ? Object.assign(Object.assign({}, item), { quantity: item.quantity + 1 }) : item);
            }
            return [...prev, Object.assign(Object.assign({}, med), { quantity: 1 })];
        });
    };
    const handleUpdateQty = (id, qty) => {
        setCart(prev => prev.map(item => item.id === id ? Object.assign(Object.assign({}, item), { quantity: qty }) : item));
    };
    const handleRemoveFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };
    const handleClearCart = () => setCart([]);
    const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    useEffect(() => {
        const saved = localStorage.getItem('medicare_user');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setUser(parsed);
            }
            catch (e) { }
        }
    }, []);
    const handleSetUser = (u) => {
        setUser(u);
        if (u)
            localStorage.setItem('medicare_user', JSON.stringify(u));
        else
            localStorage.removeItem('medicare_user');
    };
    return (React.createElement(Router, null,
        React.createElement(ScrollToTop, null),
        React.createElement(Layout, { user: user, onLogout: () => handleSetUser(null), cartCount: totalCartCount },
            React.createElement(Routes, null,
                React.createElement(Route, { path: "/", element: React.createElement(Home, null) }),
                React.createElement(Route, { path: "/browse", element: React.createElement(BrowseMedicines, { onAddToCart: handleAddToCart }) }),
                React.createElement(Route, { path: "/medicine/:id", element: React.createElement(MedicineDetail, { onAddToCart: handleAddToCart }) }),
                React.createElement(Route, { path: "/cart", element: React.createElement(Cart, { items: cart, onRemove: handleRemoveFromCart, onUpdateQty: handleUpdateQty }) }),
                React.createElement(Route, { path: "/login", element: React.createElement(Login, { onLogin: handleSetUser }) }),
                React.createElement(Route, { path: "/about", element: React.createElement(About, null) }),
                React.createElement(Route, { path: "/contact", element: React.createElement(Contact, null) }),
                React.createElement(Route, { path: "/faq", element: React.createElement(FAQ, null) }),
                React.createElement(Route, { path: "/help", element: React.createElement(HelpCenter, null) }),
                React.createElement(Route, { path: "/categories", element: React.createElement(Categories, null) }),
                React.createElement(Route, { path: "/track-order", element: React.createElement(TrackOrder, null) }),
                React.createElement(Route, { path: "/privacy", element: React.createElement(PrivacyPolicy, null) }),
                React.createElement(Route, { path: "/terms", element: React.createElement(TermsOfService, null) }),
                React.createElement(Route, { path: "/return-policy", element: React.createElement(ReturnPolicy, null) }),
                React.createElement(Route, { path: "/delivery", element: React.createElement(DeliveryPolicy, null) }),
                React.createElement(Route, { path: "/cookie-settings", element: React.createElement(CookieSettings, null) }),
                React.createElement(Route, { path: "/admin", element: (user === null || user === void 0 ? void 0 : user.role) === UserRole.ADMIN ? React.createElement(AdminDashboard, null) : React.createElement(Navigate, { to: "/login" }) }),
                React.createElement(Route, { path: "/dashboard", element: user ? React.createElement(CustomerDashboard, { user: user }) : React.createElement(Navigate, { to: "/login" }) }),
                React.createElement(Route, { path: "/checkout", element: React.createElement(Checkout, { user: user, cart: cart, onClearCart: handleClearCart }) }),
                React.createElement(Route, { path: "*", element: React.createElement(Navigate, { to: "/" }) })))));
};
export default App;
