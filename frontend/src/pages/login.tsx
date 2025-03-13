import React, { useState } from 'react';
import { Box, Button, Input, VStack, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://your-api-url.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/weather');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    }
  };
const handleGuest = () => {
    navigate('/weather');
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
      <VStack spacing={4} padding={8} boxShadow="md">
        <Heading>Login</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <form onSubmit={handleLogin}>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            mt={2}
          />
          <Button type="submit" colorScheme="blue" width="full" mt={2}>
            Login
          </Button>
        </form>
        <Button variant="outline" onClick={handleGuest} width="full">
          Continue as Guest
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;