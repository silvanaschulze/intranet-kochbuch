/**
 * @fileoverview Profilseite des Benutzers
 * @component ProfilePage
 */

import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

/**
 * ProfilePage Komponente
 * Zeigt die Profilinformationen des eingeloggten Benutzers an
 * @returns {JSX.Element} Die gerenderte ProfilePage Komponente
 */
const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Container className="py-4">
      <h1 className="mb-4">Mein Profil</h1>
      <Card>
        <Card.Body>
          <Card.Title>Benutzerdaten</Card.Title>
          <div className="mb-3">
            <strong>Name:</strong> {user?.name || 'Nicht angegeben'}
          </div>
          <div className="mb-3">
            <strong>E-Mail:</strong> {user?.email}
          </div>
          <div className="mb-3">
            <strong>Mitglied seit:</strong> {
              user?.created_at 
                ? new Date(user.created_at).toLocaleDateString('de-DE')
                : 'Nicht verfügbar'
            }
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage; 