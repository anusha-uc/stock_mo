import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [hashed_password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
 
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8000/register', {
        username,
        email,
        hashed_password,
      });
      // Handle successful registration
      setSuccess('Registration successful!');
      setError('');
      console.log(response.data);
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      // Handle registration error
    } catch (error) {
      setError('Registration failed. Please try again.');
      setSuccess('');
      console.error('Registration error:', error);
      // Refresh Registration failure message after 2 secs
      setTimeout(() => {
        setError('');
      }, 2000);
      
    }
  };

  return (
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
        <InputLabel htmlFor="username">User Name</InputLabel>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl variant="standard">
        <InputLabel htmlFor="email">Email ID</InputLabel>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl variant="standard">
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type="password"
          value={hashed_password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button variant="outlined" onClick={handleRegister}>Register</Button>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
    </Box>
  );
};

export default Register;
