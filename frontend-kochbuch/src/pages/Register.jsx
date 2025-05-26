import React, { useContext, useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Validierungsschema für das Registrierungsformular
const RegisterSchema = Yup.object().shape({
  // Name muss mindestens 3 Zeichen lang sein
  name: Yup.string()
    .min(3, 'Name muss mindestens 3 Zeichen haben')
    .required('Name ist erforderlich'),
  // E-Mail-Validierung
  email: Yup.string()
    .email('Ungültige E-Mail-Adresse')
    .required('E-Mail ist erforderlich'),
  // Passwort-Validierung mit Sicherheitsanforderungen
  password: Yup.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen haben')
    .matches(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
    .matches(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten')
    .matches(/[!@#$%^&*]/, 'Passwort muss mindestens ein Sonderzeichen enthalten')
    .required('Passwort ist erforderlich'),
  // Passwortbestätigung muss mit dem Passwort übereinstimmen
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwörter müssen übereinstimmen')
    .required('Passwortbestätigung ist erforderlich')
});

// Registrierungskomponente
const Register = () => {
  // Context und State-Hooks
  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Formular absenden
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Registrierungsversuch mit den eingegebenen Daten
      const success = await register(values.name, values.email, values.password);
      if (success) {
        // Bei erfolgreicher Registrierung
        setRegistrationSuccess(true);
        // Weiterleitung zur Login-Seite nach 2 Sekunden
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Fehler bei der Registrierung:', err);
    } finally {
      // Formular-Submission-Status zurücksetzen
      setSubmitting(false);
    }
  };

  // Render der Komponente
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card>
            <Card.Header as="h4" className="text-center">Registrieren</Card.Header>
            <Card.Body>
              {/* Fehlermeldung anzeigen, falls vorhanden */}
              {error && <Alert variant="danger">{error}</Alert>}
              {/* Erfolgsmeldung anzeigen nach erfolgreicher Registrierung */}
              {registrationSuccess && (
                <Alert variant="success">
                  Registrierung erfolgreich! Sie werden zur Anmeldeseite weitergeleitet...
                </Alert>
              )}
              
              {/* Formular mit Formik für Validierung und State-Management */}
              <Formik
                initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={RegisterSchema}
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
                    {/* Namensfeld */}
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.name && errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* E-Mail-Feld */}
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

                    {/* Passwortfeld */}
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

                    {/* Passwortbestätigungsfeld */}
                    <Form.Group className="mb-3">
                      <Form.Label>Passwort bestätigen</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.confirmPassword && errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Registrierungsbutton */}
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Registrierung läuft...' : 'Registrieren'}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
            {/* Link zur Login-Seite */}
            <Card.Footer className="text-center">
              Bereits ein Konto? <Link to="/login">Anmelden</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
