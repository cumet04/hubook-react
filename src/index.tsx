import React from 'react';
import ReactDOM from 'react-dom';
import {ContextProvider} from './contexts';
import App from './App';
import './_index.css'; // importing tailwind's output, and esbuild minify it
import {BrowserRouter} from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ContextProvider>
        <App />
      </ContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
