/**
 * @fileoverview Login-Seite für die Benutzerauthentifizierung
 * @component Login
 */

import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Formular absenden
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoginError(''); // Limpa erros anteriores
      const response = await login(values.email, values.password);
      console.log('Login response:', response);
      
      if (response && response.token) {
        setLoginSuccess(true);
        // Weiterleitung zur Startseite nach 2 Sekunden
        setTimeout(() => {
          navigate('/rezepte');
        }, 2000);
      } else {
        setLoginError('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
      }
    } catch (err) {
      console.error('Fehler beim Anmelden:', err);
      setLoginError(
        err.response?.data?.fehler || 
        'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
      );
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
              {loginError && <Alert variant="danger">{loginError}</Alert>}
              {loginSuccess && (
                <Alert variant="success">
                  Login erfolgreich! Sie werden weitergeleitet...
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
