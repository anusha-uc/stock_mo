// Watchlist.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddSymbol from './AddSymbol';
import { Box, Button }from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

interface WatchlistItem {
  symbol: string;
}

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href ='/login';
  }
  const fetchWatchlist = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (!token) {
        throw new Error('Token not found in local storage');
      }
      const response = await axios.get('http://localhost:8000/watchlist', {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });
      setWatchlist(response.data);
    } catch (error) {
      console.error('Fetch watchlist error:', error);
      // Handle fetch watchlist error
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <div>
      <br />
        <h1>Watchlist</h1>
        <AddSymbol />

        {watchlist.map((item, index) => (
          <div key={index}>
            <br />
            <Link to={`/dashboard/${item.symbol}`} style={{ textDecoration: 'none' }}>
              <Button variant="contained" color='info'>
                {item.symbol}
              </Button>
            </Link>

            <br />
          </div>
        ))}
      </div>
    </Box>
  );
};

export default Watchlist;
