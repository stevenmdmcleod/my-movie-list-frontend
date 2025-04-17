import React from "react";
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';

// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement
// );
const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
)