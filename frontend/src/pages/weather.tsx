import React, { useState } from 'react';
import { Box, Flex, Heading, Input, Button, VStack, Text, Spacer } from '@chakra-ui/react';

interface WeatherData {
  id: number;
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number };
  weather: { main: string; description: string }[];
  wind: { speed: number };
}

let weatherId = 0;

const weatherIcons: Record<string, string> = {
  Clear: '☀️',
  Cloudy: '☁️',
  Rain: '🌧️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
};


const Weather: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weatherList, setWeatherList] = useState<WeatherData[]>([]);

  const getMockWeather = () => {
    const mockData: WeatherData = {
      id: weatherId++, // unique ID for removal
      name: city || `City ${weatherId}`,
      sys: { country: "US" },
      main: {
        temp: 26 + Math.floor(Math.random() * 10),
        humidity: 60 + Math.floor(Math.random() * 20),
      },
      weather: [
        { main: "Clear", description: "" }
      ],
      wind: { speed: 3.6 + Math.random() * 2 }
    };

    setWeatherList(prev => [mockData, ...prev]);
    setCity('');
  };

  const removeWeather = (id: number) => {
    setWeatherList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Box 
      p={8} 
      height="100vh"
      backgroundImage="url(public/cloudy.jpeg)"
      backgroundSize="cover"
      backgroundPosition="center"
      color="white"
      overflowY="auto"
    >
      {/* Top Bar */}
      <Flex mb={6} align="center">
        <Heading>WeatherX</Heading>
        <Spacer />
        <Button colorScheme="red" variant="outline">Sign Out</Button>
      </Flex>

      {/* Input */}
      <VStack  mb={6}>
        <Input 
          placeholder="Enter city" 
          width="300px" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
        />
        <Button colorScheme="blue" onClick={getMockWeather}>Get Weather</Button>
      </VStack>

      {/* Weather Boxes */}
      <Flex wrap="wrap" gap={4} justify="center">
  {weatherList.map((weather) => (
    <Box 
      key={weather.id}
      p={4} 
      bg="blackAlpha.600" 
      borderRadius="xl"
      backdropFilter="blur(8px)"
      textAlign="center" 
      position="relative"
      width="300px"
    >
    <Box
      position="absolute"
      top="8px"
      left="8px"
      fontSize="2xl"
      >
      {weatherIcons[weather.weather[0].main] || '❓'}
    </Box>

      {/* Close Button */}
      <Box
        as="button"
        position="absolute"
        top="8px"
        right="8px"
        fontSize="lg"
        fontWeight="bold"
        background="transparent"
        border="none"
        color="white"
        _hover={{ color: 'red.300', transform: 'scale(1.2)' }}
        onClick={() => removeWeather(weather.id)}
        cursor="pointer"
      >
        ×
      </Box>

      <Text fontSize="xl" fontWeight="bold">{weather.name}, {weather.sys.country}</Text>
      <Text fontSize="2xl">{Math.round(weather.main.temp)}°C</Text>
      <Text>{weather.weather[0].main} - {weather.weather[0].description}</Text>
      <Text>Humidity: {weather.main.humidity}%</Text>
      <Text>Wind: {weather.wind.speed.toFixed(1)} m/s</Text>
    </Box>
  ))}
</Flex>
    </Box>
  );
};

export default Weather;
