import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddSymbol: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('');

  const handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(event.target.value);
  };
  const navigate = useNavigate();
  const handleSubmit = async () =>  {
  try {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      throw new Error('Token not found in local storage');
    }
    const response = await axios.post(
      'http://localhost:8000/watchlist',
      { symbol }, // Send data in the format { "symbol": "string" }
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Response:', response.data);
    window.location.href ='/watchlist';
  } catch (error) {
    console.error('Error:', error);
  }
  };

  return (
    <div>
      <TextField
        label="Add Symbol"
        variant="outlined"
        value={symbol}
        onChange={handleSymbolChange}
      />   <Button variant="contained" onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default AddSymbol;
