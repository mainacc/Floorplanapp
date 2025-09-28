import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import './styles.css';
import { registerServiceWorker } from './app/registerServiceWorker';

const basename = import.meta.env.BASE_URL ?? '/';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (import.meta.env.PROD) {
  registerServiceWorker();
}
