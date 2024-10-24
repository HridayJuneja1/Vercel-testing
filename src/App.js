import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PasswordChange from './components/PasswordChange';
import SignUpConfirmation from './components/SignUpConfirmation';
import VerificationSuccess from './components/VerificationSuccess';
import Footer from './components/Footer';
import Header from './components/Header';
import MyBooks from './components/MyBooks';
import Home from './components/Home';
import Banner from './components/Banner';
import FAQSection from './components/FAQSection';
import BrowseBooks from './components/BrowseBooks';
import Cart from './components/Cart';
import Contact from './components/Contact';
import BookDetails from './components/BookDetails';
import Checkout from './components/Checkout';
import FAQ from './components/FAQ';
import OrderConfirmed from './components/OrderConfirmed';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import BookPickup from './components/BookPickup';
import Dashboard from './components/Dashboard';
import PickupConfirmed from './components/PickupConfirmed';
import './config/i18n';

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

const AppInner = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mybooks" element={<MyBooksPage />} />
        <Route path="/change-password" element={<PasswordChange />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/browse-books" element={<BrowseBooks />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/signup-confirmation" element={<SignUpConfirmation />} />
        <Route path="/book/:bookId" element={<BookDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/book-pickup" element={<BookPickup />} />
        <Route path="/dashboard/:userId/*" element={<Dashboard />} />
        <Route path="/api/users/verify/:token" element={<VerificationSuccess />} />
        <Route path="/pickup-confirmed" element={<PickupConfirmed />} />
      </Routes>
      <Footer />
    </>
  );
};

const HomePage = () => (
  <>
    <Banner />
    <Home />
    <FAQSection />
  </>
);

const MyBooksPage = () => (
  <>
    <Header />
    <MyBooks />
  </>
);

const CheckoutPage = () => (
  <>
    <Checkout />
    <FAQ />
  </>
);

export default App;
