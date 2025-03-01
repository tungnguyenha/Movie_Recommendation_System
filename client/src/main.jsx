//import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GlobalStyle from './components/GlobalStyle';
import {BrowserRouter} from 'react-router-dom'
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      <GlobalStyle>
        <App />
      </GlobalStyle>
    </BrowserRouter>
  // </React.StrictMode>,
)
