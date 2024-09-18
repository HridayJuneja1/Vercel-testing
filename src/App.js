import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PasswordChange from './components/PasswordChange';
import SignUpConfirmation from './components/SignUpConfirmation';
import VerificationSuccess from './components/VerificationSuccess';
import Footer from './components/Footer';
import { Header, FeatureSection } from './components/MyBooks';
import { Banner, HomeFeature, FAQSection } from './components/Home';
import BrowseBooks from './components/BrowseBooks.js';
import Cart from './components/Cart.js';
import Contact from './components/Contact';
import BookDetails from './components/BookDetails';
import Checkout from './components/Checkout';
import FAQ from './components/FAQ';
import OrderConfirmed from './components/OrderConfirmed.js';
import ForgotPassword from './components/ForgotPassword.js';
import ResetPassword from './components/ResetPassword.js';
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
        <Route path="/" element={
          <>
            <Banner />
            <HomeFeature />
            <FAQSection />
          </>
        } />
        <Route path="/MyBooks" element={
          <>
            <Header />
            <FeatureSection />
          </>
        } />

        <Route path="/checkout" element={
          <>
            <Checkout />
            <FAQ />
          </>
        } />
        <Route path="/change-password" element={
          <>
            <PasswordChange />
          </>
        } />
        <Route path="/login" element={
          <>
            <Login />
          </>
        } />
        <Route path="/signup" element={
          <>
            <SignUp />
          </>
        } />
        <Route path="/browse-books" element={
          <>
            <BrowseBooks />
          </>
        } />
        <Route path="/cart" element={
          <>
            <Cart />
          </>
        } />
        <Route path="/forgot-password" element={
          <>
            <ForgotPassword />
          </>
        } />
        <Route path="/reset-password/:token" element={<ResetPassword />} />


        <Route path="/change-password" element={<PasswordChange />} />
        <Route path="/signup-confirmation" element={<SignUpConfirmation />} />
        <Route path="/verify-success" element={<VerificationSuccess />} />
        <Route path="/book/:bookId" element={<BookDetails />} />
        <Route path="/browse-books" element={<BrowseBooks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
      </Routes>
      <>
        <Footer />
      </>
    </>
  );
};

export default App;

