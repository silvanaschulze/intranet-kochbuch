/**
 * @fileoverview Header-Komponente mit Navigation und Authentifizierungsstatus
 * @component Header
 */

import React, { useContext, useEffect } from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Header-Komponente mit Navigationsmenü
 * Zeigt verschiedene Menüoptionen basierend auf dem Authentifizierungsstatus an
 * @returns {JSX.Element} Die gerenderte Header-Komponente
 */
const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Auth Status:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  /**
   * Behandelt den Logout-Prozess
   * Löscht den Token und leitet zur Login-Seite weiter
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userName = user?.name || user?.email || 'Benutzer';

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">Intranet-Kochbuch</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
            >
              Startseite
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/rezepte" 
              active={location.pathname === '/rezepte'}
            >
              Rezepte
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link 
                as={Link} 
                to="/rezept-erstellen"
                active={location.pathname === '/rezept-erstellen'}
              >
                Rezept erstellen
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={`Willkommen, ${userName}`} 
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item 
                  as={Link} 
                  to="/profil"
                  active={location.pathname === '/profil'}
                >
                  Mein Profil
                </NavDropdown.Item>
                <NavDropdown.Item 
                  as={Link} 
                  to="/meine-rezepte"
                  active={location.pathname === '/meine-rezepte'}
                >
                  Meine Rezepte
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Abmelden
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login"
                  active={location.pathname === '/login'}
                >
                  Anmelden
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/register"
                  active={location.pathname === '/register'}
                >
                  Registrieren
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
