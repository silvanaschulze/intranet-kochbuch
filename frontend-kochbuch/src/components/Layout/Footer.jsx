/**
 * @fileoverview Footer-Komponente mit Copyright-Information
 * @component Footer
 */

import React from 'react';
import { Container } from 'react-bootstrap';

/**
 * Footer-Komponente
 * Zeigt Copyright-Informationen und andere Footer-Inhalte an
 * @returns {JSX.Element} Die gerenderte Footer-Komponente
 */
const Footer = () => (
  <footer className="bg-dark text-light py-3 mt-auto">
    <Container className="text-center">
      <p className="mb-0">&copy; {new Date().getFullYear()} Intranet-Kochbuch. Alle Rechte vorbehalten.</p>
    </Container>
  </footer>
);

export default Footer;
