import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Router } from './routes/Router.tsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster />
    <Router />
  </React.StrictMode>,
);
