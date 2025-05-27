/**
 * @fileoverview Seite zum Erstellen eines neuen Rezepts
 * @component CreateRecipePage
 */

import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../services/recipeService';

/**
 * @typedef {Object} Zutat
 * @property {string} name - Name der Zutat
 * @property {string} menge - Menge der Zutat
 * @property {string} einheit - Einheit der Zutat
 */

/**
 * @typedef {Object} FormData
 * @property {string} titel - Titel des Rezepts
 * @property {Zutat[]} zutaten - Liste der Zutaten
 * @property {string} zubereitung - Zubereitungsanleitung
 * @property {string} zubereitungszeit - Geschätzte Zubereitungszeit
 * @property {string} schwierigkeitsgrad - Schwierigkeitsgrad des Rezepts
 * @property {File} [bild] - Optionales Bild des Rezepts
 */

/**
 * CreateRecipePage Komponente
 * Stellt ein Formular zum Erstellen eines neuen Rezepts bereit
 * @returns {JSX.Element} Die gerenderte CreateRecipePage Komponente
 */
const CreateRecipePage = () => {
  const navigate = useNavigate();

  /**
   * @type {FormData}
   */
  const initialFormData = {
    titel: '',
    zutaten: [{ name: '', menge: '', einheit: '' }],
    zubereitung: '',
    zubereitungszeit: '',
    schwierigkeitsgrad: '',
    bild: null
  };

  // State-Verwaltung
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

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
   * Aktualisiert die Formulardaten bei Benutzereingabe
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>} e - Das Change-Event
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
   * Fügt eine neue leere Zutat hinzu
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
      
      // Vorschau erstellen
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
      const response = await createRecipe(formData);
      navigate(`/rezepte/${response.id}`);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: 'Fehler beim Erstellen des Rezepts. Bitte versuchen Sie es später erneut.'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Neues Rezept erstellen</h1>

      {errors.submit && (
        <Alert variant="danger" className="mb-4">
          {errors.submit}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
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
            <div key={index} className="d-flex gap-2 mb-2">
              <Form.Control
                type="text"
                placeholder="Name"
                value={zutat.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              />
              <Form.Control
                type="text"
                placeholder="Menge"
                value={zutat.menge}
                onChange={(e) => handleIngredientChange(index, 'menge', e.target.value)}
              />
              <Form.Control
                type="text"
                placeholder="Einheit"
                value={zutat.einheit}
                onChange={(e) => handleIngredientChange(index, 'einheit', e.target.value)}
              />
              <Button
                variant="outline-danger"
                onClick={() => removeIngredient(index)}
                disabled={formData.zutaten.length === 1}
              >
                Entfernen
              </Button>
            </div>
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
            {loading ? 'Wird erstellt...' : 'Rezept erstellen'}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate('/rezepte')}
          >
            Abbrechen
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateRecipePage; 