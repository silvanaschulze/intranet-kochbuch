/**
 * @fileoverview Startseite der Anwendung
 * @component Home
 */

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Home Komponente
 * Zeigt die Startseite mit Willkommensnachricht und Aktionsschaltflächen an
 * @returns {JSX.Element} Die gerenderte Home Komponente
 */
const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col md={8}>
          <h1 className="display-4 mb-4">Willkommen beim Intranet-Kochbuch</h1>
          <p className="lead mb-4">
            Entdecken Sie eine Vielzahl von köstlichen Rezepten, teilen Sie Ihre eigenen Kreationen und lassen Sie sich von unserer Gemeinschaft inspirieren.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Button as={Link} to="/rezepte" variant="primary" size="lg" className="px-4 me-sm-3">
              Rezepte entdecken
            </Button>
            {isAuthenticated ? (
              <Button as={Link} to="/rezept-erstellen" variant="outline-primary" size="lg" className="px-4">
                Rezept erstellen
              </Button>
            ) : (
              <Button as={Link} to="/register" variant="outline-primary" size="lg" className="px-4">
                Jetzt registrieren
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;