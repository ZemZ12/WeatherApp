import { useState } from 'react';
import { Box, Button, Input, VStack, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://weatherApp46.xyz/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username:email, password:password })
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
  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
  <Box
    width="100vw"
    height="100vh"
    backgroundImage="url('https://img.freepik.com/free-vector/sunshine-background-poster_1284-9444.jpg?t=st=1743115024~exp=1743118624~hmac=0834a7dfaaf21c1ab2def4d110fa89e917243b46c5377b619e5da87f680b50a6&w=740')"
    backgroundSize="cover"
    backgroundPosition="center"
    backgroundRepeat="no-repeat"
    display="flex" // Center content
    alignItems="center" // Vertically center
    justifyContent="center" // Horizontally center
  >
    <VStack
      padding={8}
      boxShadow="md"
      backdropFilter="blur(25px)"
      bg="transparent" // Add a background color to make it visible
      borderRadius="lg" // Optional: Makes it rounded
      p={6} // Adds some padding
    >
      <Heading color={'black'}>WeatherX</Heading>
      {error && <Text color="red.500">{error}</Text>}
      <form onSubmit={handleLogin} style={{ width: "100%" }}>
        <Input
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <Button  
          type="submit"
          colorScheme="blue"
          bg="transparent" 
          color="white"
          border= "1px solid"
          borderColor="black"
          _hover={{ bg: "black" }} // Change background and text color on hover
          width="full"
          mt={2}
          >
          Login
        </Button>
      </form>
      <Button variant="outline" onClick={handleGuest} width="full">
        Continue as Guest
      </Button>
      <Button variant="outline" _hover={{bg:"green.400", color: "black"}} onClick={handleRegister} width="full">
        Register
      </Button>
    </VStack>
  </Box>
</Box>
  );
};

export default Login;