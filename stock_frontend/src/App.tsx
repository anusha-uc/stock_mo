// App.tsx
import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Watchlist from './components/Watchlist';
import Dashboard from './components/Dashboard';
import ResponsiveAppBar from './components/NavBar';
import { Route, Routes } from 'react-router-dom';


const App: React.FC = () => {
  return (
    <div>
      <ResponsiveAppBar/>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/watchlist' element={<Watchlist/>} />
        <Route path="/dashboard/:symbol" element={<Dashboard/>} />
      </Routes>
    </div>
  );
};

export default App;
