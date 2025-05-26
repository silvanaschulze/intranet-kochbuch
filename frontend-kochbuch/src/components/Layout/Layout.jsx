import React from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Container className="py-4 min-vh-100">
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default Layout;
