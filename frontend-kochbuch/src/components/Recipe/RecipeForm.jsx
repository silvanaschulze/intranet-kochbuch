/**
 * @fileoverview Formularkomponente für Rezepte
 * @component RecipeForm
 */

import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} Zutat
 * @property {string} name - Name der Zutat
 * @property {string} menge - Menge der Zutat
 * @property {string} einheit - Einheit der Zutat
 */

/**
 * @typedef {Object} RecipeFormData
 * @property {string} titel - Titel des Rezepts
 * @property {Zutat[]} zutaten - Liste der Zutaten
 * @property {string} zubereitung - Zubereitungsanleitung
 * @property {string} zubereitungszeit - Geschätzte Zubereitungszeit
 * @property {string} schwierigkeitsgrad - Schwierigkeitsgrad des Rezepts
 * @property {File} [bild] - Optionales Bild des Rezepts
 */

/**
 * RecipeForm Komponente
 * Wiederverwendbares Formular für das Erstellen und Bearbeiten von Rezepten
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {RecipeFormData} [props.initialData] - Initiale Daten für das Formular
 * @param {boolean} [props.isEditing=false] - Gibt an, ob das Formular zum Bearbeiten verwendet wird
 * @param {Function} props.onSubmit - Callback-Funktion beim Absenden des Formulars
 * @param {Function} props.onCancel - Callback-Funktion beim Abbrechen
 * @returns {JSX.Element} Die gerenderte RecipeForm Komponente
 */
const RecipeForm = ({ initialData, isEditing = false, onSubmit, onCancel }) => {
  const defaultFormData = {
    titel: '',
    zutaten: [{ name: '', menge: '', einheit: '' }],
    zubereitung: '',
    zubereitungszeit: '',
    schwierigkeitsgrad: '',
    bild: null
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData?.bild_url) {
      setImagePreview(initialData.bild_url);
    }
  }, [initialData]);

  /**
   * Validiert die Formulardaten
   * @returns {boolean} True wenn die Validierung erfolgreich ist
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.titel.trim()) {
      newErrors.titel = 'Titel ist erforderlich';
    }

    if (!formData.zubereitung.trim()) {
      newErrors.zubereitung = 'Zubereitungsanleitung ist erforderlich';
    }

    if (!formData.zubereitungszeit.trim()) {
      newErrors.zubereitungszeit = 'Zubereitungszeit ist erforderlich';
    }

    if (!formData.schwierigkeitsgrad) {
      newErrors.schwierigkeitsgrad = 'Schwierigkeitsgrad ist erforderlich';
    }

    const hasValidIngredients = formData.zutaten.every(zutat => 
      zutat.name.trim() && zutat.menge.trim() && zutat.einheit.trim()
    );

    if (!hasValidIngredients) {
      newErrors.zutaten = 'Alle Zutatenfelder müssen ausgefüllt sein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Aktualisiert die Formulardaten
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>} e - Das Change-Event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Aktualisiert die Zutatendaten
   * @param {number} index - Index der Zutat
   * @param {string} field - Zu änderndes Feld
   * @param {string} value - Neuer Wert
   */
  const handleIngredientChange = (index, field, value) => {
    const newZutaten = [...formData.zutaten];
    newZutaten[index] = {
      ...newZutaten[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      zutaten: newZutaten
    }));
  };

  /**
   * Fügt eine neue Zutat hinzu
   */
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      zutaten: [...prev.zutaten, { name: '', menge: '', einheit: '' }]
    }));
  };

  /**
   * Entfernt eine Zutat
   * @param {number} index - Index der zu entfernenden Zutat
   */
  const removeIngredient = (index) => {
    if (formData.zutaten.length > 1) {
      setFormData(prev => ({
        ...prev,
        zutaten: prev.zutaten.filter((_, i) => i !== index)
      }));
    }
  };

  /**
   * Verarbeitet das Hochladen eines Bildes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Das Change-Event
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        bild: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Verarbeitet das Absenden des Formulars
   * @param {React.FormEvent<HTMLFormElement>} e - Das Submit-Event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: 'Fehler beim Speichern des Rezepts. Bitte versuchen Sie es später erneut.'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {errors.submit && (
        <Alert variant="danger" className="mb-4">
          {errors.submit}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Titel</Form.Label>
        <Form.Control
          type="text"
          name="titel"
          value={formData.titel}
          onChange={handleChange}
          isInvalid={!!errors.titel}
        />
        <Form.Control.Feedback type="invalid">
          {errors.titel}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Zutaten</Form.Label>
        {formData.zutaten.map((zutat, index) => (
          <Row key={index} className="mb-2">
            <Col>
              <Form.Control
                type="text"
                placeholder="Name"
                value={zutat.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Menge"
                value={zutat.menge}
                onChange={(e) => handleIngredientChange(index, 'menge', e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Einheit"
                value={zutat.einheit}
                onChange={(e) => handleIngredientChange(index, 'einheit', e.target.value)}
              />
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-danger"
                onClick={() => removeIngredient(index)}
                disabled={formData.zutaten.length === 1}
              >
                Entfernen
              </Button>
            </Col>
          </Row>
        ))}
        <Button
          variant="outline-primary"
          type="button"
          onClick={addIngredient}
          className="mt-2"
        >
          Zutat hinzufügen
        </Button>
        {errors.zutaten && (
          <div className="text-danger mt-2">
            {errors.zutaten}
          </div>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Zubereitung</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          name="zubereitung"
          value={formData.zubereitung}
          onChange={handleChange}
          isInvalid={!!errors.zubereitung}
        />
        <Form.Control.Feedback type="invalid">
          {errors.zubereitung}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Zubereitungszeit</Form.Label>
        <Form.Control
          type="text"
          name="zubereitungszeit"
          value={formData.zubereitungszeit}
          onChange={handleChange}
          placeholder="z.B. 30 Minuten"
          isInvalid={!!errors.zubereitungszeit}
        />
        <Form.Control.Feedback type="invalid">
          {errors.zubereitungszeit}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Schwierigkeitsgrad</Form.Label>
        <Form.Select
          name="schwierigkeitsgrad"
          value={formData.schwierigkeitsgrad}
          onChange={handleChange}
          isInvalid={!!errors.schwierigkeitsgrad}
        >
          <option value="">Bitte wählen</option>
          <option value="Einfach">Einfach</option>
          <option value="Mittel">Mittel</option>
          <option value="Schwer">Schwer</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.schwierigkeitsgrad}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Bild</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Vorschau"
            className="mt-2"
            style={{ maxWidth: '200px' }}
          />
        )}
      </Form.Group>

      <div className="d-flex gap-2">
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Wird gespeichert...' : (isEditing ? 'Speichern' : 'Erstellen')}
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
        >
          Abbrechen
        </Button>
      </div>
    </Form>
  );
};

RecipeForm.propTypes = {
  initialData: PropTypes.shape({
    titel: PropTypes.string,
    zutaten: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        menge: PropTypes.string,
        einheit: PropTypes.string
      })
    ),
    zubereitung: PropTypes.string,
    zubereitungszeit: PropTypes.string,
    schwierigkeitsgrad: PropTypes.string,
    bild_url: PropTypes.string
  }),
  isEditing: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default RecipeForm;
