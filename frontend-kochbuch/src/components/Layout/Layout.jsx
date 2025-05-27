/**
 * @fileoverview Hauptlayout-Komponente, die Header und Footer umschließt
 * @component Layout
 */

import React from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout-Komponente, die die grundlegende Seitenstruktur definiert
 * @param {Object} props - Komponenteneigenschaften
 * @param {React.ReactNode} props.children - Kindkomponenten, die zwischen Header und Footer angezeigt werden
 * @returns {JSX.Element} Die gerenderte Layout-Komponente
 */
const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="py-4 min-vh-100">
        {children}
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;
