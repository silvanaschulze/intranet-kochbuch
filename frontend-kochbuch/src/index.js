/**
 * @fileoverview Haupteinstiegspunkt der React-Anwendung
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * Rendert die Hauptanwendung in das DOM
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
