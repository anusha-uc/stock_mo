// Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const handleLogin = async (event: React.FormEvent) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded' // or 'multipart/form-data' depending on your server's requirements
  }
};
    try {
      event.preventDefault();
      const response = await axios.post('http://localhost:8000/token', formData, config);
      console.log(response.data)
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      // Handle successful login, e.g., store token in local storage
      window.location.href ='/watchlist';
  
      
    } catch (error) {
      // Handle login error
      setError('Login failed..');
      console.error('Login error:', error);
      // Refresh Registration failure message after 2 secs
      setTimeout(() => {
        setError('');
      }, 2000);
            
    }
  };

  return (
    <div>
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1 },
      }}
      noValidate
      autoComplete="off"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
    >
      <FormControl variant="standard">
        <InputLabel htmlFor="component-simple">User Name</InputLabel>
        <Input
          id="component"
          defaultValue=" "
          type = "text"
          value = {username}
          onChange={(e) => setUsername(e.target.value)}
          />
      </FormControl>
      
      <FormControl variant="standard">
        <InputLabel htmlFor="component-simple">Password</InputLabel>
        <Input
          id="component-simple"
          // defaultValue="Composed TextField"
          type = "password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
      </FormControl>
      <Button variant="outlined" onClick={handleLogin}>Login</Button>
      
    </Box>
     {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </div>
  );  
};

export default Login;
