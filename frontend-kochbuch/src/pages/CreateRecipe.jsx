import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../services/recipeService';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    titel: '',
    zutaten: [{ name: '', menge: '', einheit: '' }],
    zubereitung: '',
    zubereitungszeit: '',
    schwierigkeitsgrad: 'Einfach',
    bild: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      bild: file
    }));
  };

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

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      zutaten: [...prev.zutaten, { name: '', menge: '', einheit: '' }]
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      zutaten: prev.zutaten.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createRecipe(formData);
      navigate('/rezepte');
    } catch (err) {
      setError(err.response?.data?.fehler || 'Fehler beim Erstellen des Rezepts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header as="h4">Neues Rezept erstellen</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titel</Form.Label>
              <Form.Control
                type="text"
                name="titel"
                value={formData.titel}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Zutaten</Form.Label>
              {formData.zutaten.map((zutat, index) => (
                <div key={index} className="d-flex gap-2 mb-2">
                  <Form.Control
                    placeholder="Name"
                    value={zutat.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  />
                  <Form.Control
                    placeholder="Menge"
                    value={zutat.menge}
                    onChange={(e) => handleIngredientChange(index, 'menge', e.target.value)}
                    style={{ width: '100px' }}
                  />
                  <Form.Control
                    placeholder="Einheit"
                    value={zutat.einheit}
                    onChange={(e) => handleIngredientChange(index, 'einheit', e.target.value)}
                    style={{ width: '100px' }}
                  />
                  <Button 
                    variant="outline-danger"
                    onClick={() => removeIngredient(index)}
                    disabled={formData.zutaten.length === 1}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline-secondary" 
                onClick={addIngredient}
                className="mt-2"
              >
                + Zutat hinzufügen
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Zubereitung</Form.Label>
              <Form.Control
                as="textarea"
                name="zubereitung"
                value={formData.zubereitung}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Zubereitungszeit</Form.Label>
              <Form.Control
                type="text"
                name="zubereitungszeit"
                value={formData.zubereitungszeit}
                onChange={handleInputChange}
                placeholder="z.B. 30 Minuten"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Schwierigkeitsgrad</Form.Label>
              <Form.Select
                name="schwierigkeitsgrad"
                value={formData.schwierigkeitsgrad}
                onChange={handleInputChange}
              >
                <option>Einfach</option>
                <option>Mittel</option>
                <option>Schwer</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bild</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/rezepte')}
              >
                Abbrechen
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Wird gespeichert...' : 'Rezept speichern'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateRecipe; 