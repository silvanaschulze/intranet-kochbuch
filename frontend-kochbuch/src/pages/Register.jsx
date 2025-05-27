/**
 * @fileoverview Registrierungsseite für neue Benutzer
 * @component Register
 */

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * @typedef {Object} FormData
 * @property {string} name - Name des Benutzers
 * @property {string} email - E-Mail-Adresse des Benutzers
 * @property {string} password - Passwort des Benutzers
 * @property {string} confirmPassword - Passwortbestätigung
 */

/**
 * Register Komponente
 * Stellt ein Formular für die Benutzerregistrierung bereit
 * @returns {JSX.Element} Die gerenderte Register Komponente
 */
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  /**
   * @type {FormData}
   */
  const initialFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Formularstatus
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  /**
   * Validiert die Formulardaten
   * @returns {boolean} True wenn die Validierung erfolgreich ist
   */
  const validateForm = () => {
    const newErrors = {};

    // Name validieren
    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name muss mindestens 2 Zeichen lang sein';
    }

    // E-Mail validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }

    // Passwort validieren
    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein';
    }

    // Passwortbestätigung validieren
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwortbestätigung ist erforderlich';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Aktualisiert die Formulardaten bei Benutzereingabe
   * @param {React.ChangeEvent<HTMLInputElement>} e - Das Change-Event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Fehler für das geänderte Feld zurücksetzen
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Verarbeitet das Absenden des Formulars
   * @param {React.FormEvent<HTMLFormElement>} e - Das Submit-Event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/rezepte');
    } catch (err) {
      setServerError(
        err.response?.data?.fehler || 
        'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-center mb-4">Registrieren</h2>

            {serverError && (
              <Alert variant="danger" className="mb-4">
                {serverError}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>E-Mail-Adresse</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Passwort</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Passwort bestätigen</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Wird registriert...' : 'Registrieren'}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-3">
              <p className="mb-0">
                Bereits registriert?{' '}
                <Link to="/login">Jetzt anmelden</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
