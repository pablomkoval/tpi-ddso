import { Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import React, { useState } from 'react';
import Layout from './features/layout/Layout.jsx';
//import Home from './features/home/Home.jsx';
import LoginPage from './features/login/LoginPage.jsx';



function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        
      </Route>
      <Route path="/login" element={<LoginPage />}/>
    </Routes>
  );

}

export default App;



