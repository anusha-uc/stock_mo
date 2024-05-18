import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const API_KEY = 'IO5D6BGCNKOJR5R4'; 
const Dashboard = () => {
  const { symbol } = useParams();
  const [currentPrice, setCurrentPrice] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href ='/login';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(  
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
        );
        const price = response.data['Global Quote']['05. price'];
        setCurrentPrice(price);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div><center>
      <h1>{symbol}</h1>
      {currentPrice && <h2>Current Price {currentPrice}</h2>}
      {!currentPrice && <h2>Fetching price</h2>} 
      
      </center>
    </div>
    
  );
};

export default Dashboard;
