/**
 * @fileoverview Header-Komponente mit Navigation und Authentifizierungsstatus
 * @component Header
 */

import React, { useEffect } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
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
        <Navbar.Brand as={Link} to="/">Kochbuch</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/recipes" 
              active={location.pathname === '/recipes'}
            >
              Recipes
            </Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/recipes/create"
                  active={location.pathname === '/recipes/create'}
                >
                  Create Recipe
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/profile"
                  active={location.pathname === '/profile'}
                >
                  Profile
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {!isAuthenticated ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login"
                  active={location.pathname === '/login'}
                >
                  Login
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/register"
                  active={location.pathname === '/register'}
                >
                  Register
                </Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
