/**
 * @fileoverview Login-Seite für die Benutzerauthentifizierung
 * @component Login
 */

import React, { useContext, useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Login-Schema für Formularvalidierung
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Ungültige E-Mail-Adresse')
    .required('E-Mail ist erforderlich'),
  password: Yup.string()
    .required('Passwort ist erforderlich')
});

/**
 * Login Komponente
 * Stellt ein Formular für die Benutzeranmeldung bereit
 * @returns {JSX.Element} Die gerenderte Login Komponente
 */
const Login = () => {
  // Auth-Kontext verwenden
  const { login, error, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Formular absenden
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const success = await login(values.email, values.password);
      if (success) {
       setLoginSuccess(true);
        // Weiterleitung zur Startseite nach 2 Sekunden
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      console.error('Fehler beim Anmelden:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card>
            <Card.Header as="h4" className="text-center">Anmelden</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {loginSuccess && (
                <Alert variant="success">
                  Willkommen zurück, {user?.name || 'Benutzer'}! Sie werden weitergeleitet...
                </Alert>
              )}
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>E-Mail</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && errors.email}
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
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.password && errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Anmeldung läuft...' : 'Anmelden'}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
            <Card.Footer className="text-center">
              Noch kein Konto? <Link to="/register">Registrieren</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
