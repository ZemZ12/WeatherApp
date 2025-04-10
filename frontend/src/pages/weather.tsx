import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  Spacer,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


interface WeatherData {
  id: number;
  dbId: string;
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number; feels_like: number };
  weather: { main: string; description: string }[];
  wind: { speed: number };
  coord: { lat: number; lon: number }; 
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
  const navigate = useNavigate();


  const handleSignOut = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };
  

  // const getMockWeather = () => {
  //   const mockData: WeatherData = {
  //     id: weatherId++, // unique ID for removal
  //     name: city || `City ${weatherId}`,
  //     sys: { country: 'US' },
  //     coord: { lat: 30.3322, lon: -81.6557 },
  //     main: {
  //       temp: 26 + Math.floor(Math.random() * 10),
  //       humidity: 60 + Math.floor(Math.random() * 20),
  //     },
  //     weather: [{ main: 'Clear', description: '' }],
  //     wind: { speed: 3.6 + Math.random() * 2 },
  //   };

  //   setWeatherList((prev) => [mockData, ...prev]);
  //   setCity('');
  // };

  const mapRealWeather = (apiData: any, dbId: string): WeatherData => {
    return {
      id: weatherId++,
      dbId,
      name: apiData.name,
      sys: {
        country: apiData.sys.country
      },
      coord: {
        lat: apiData.coord.lat,
        lon: apiData.coord.lon
      },
      main: {
        temp: apiData.main.temp,
        humidity: apiData.main.humidity,
        feels_like: apiData.main.feels_like
      },
      weather: [
        {
          main: apiData.weather[0].main,
          description: apiData.weather[0].description
        }
      ],
      wind: {
        speed: apiData.wind.speed
      }
    };
  };

  const getCurrentWeather = async () => {
    const token = localStorage.getItem("token");

    if(city == null) {
      alert("Please enter a City Name.");
      return;
    }

    try {
      //Get the Current Weather
      const res = await fetch(`/api/weather/currentWeather?city=${encodeURIComponent(city)}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        },
      });

      const apiData = await res.json();
     
      

      //add Location to DB
      const addLocationRes = await fetch("/api/weather/addLocation", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({city:city})
      });

      const addData = await addLocationRes.json();

      const existing = weatherList.find(
        (item) => item.name.toLowerCase() == apiData.name.toLowerCase()
      );
      if(existing){
        alert(`${apiData.name} is already in your list.`);
        return;
      }
      const weatherData = mapRealWeather(apiData, addData.dbId);
      setWeatherList((prev) => [weatherData, ...prev]);
      setCity('');
    } catch (error) {
      console.error("error fetching or saving weather data:", error);
    }
  }

  const removeWeather = async (id: number, dbId: string) => {
    setWeatherList((prev) => prev.filter((item) => item.id !== id));

    const token = localStorage.getItem("token");

    if(dbId == "current-location") {
      setWeatherList((prev) => prev.filter((item) => item.id !==id));
      return;
    }

    try {
      const res = await fetch( `/api/weather/deleteLocation/${dbId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if(res.ok) {
        console.log("Deleted from DB: ", data.message);
      } else {
        console.error("failed to delete: ", data.message);
      }
    } catch (error) {
      console.error("Error deleting Location: ", error);
    }
  };

  const fetchSavedLocations = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/weather/getLocations`, {
        headers: {
          Authorization : `Bearer ${token}`
        }
      });
      const savedLocations = await res.json();

      for (const location of savedLocations) {
        const weatherRes = await fetch(`/api/weather/currentweather?city=${encodeURIComponent(location.city)}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const apiData = await weatherRes.json();
        if(apiData.cod !== 200) continue;

        const weatherData = mapRealWeather(apiData, location._id);
        setWeatherList((prev) => [weatherData, ...prev]);
      }
    } catch (error) {
      console.error("Error loading saved locations:", error);
    }
  };

  useEffect(() => {
    fetchSavedLocations();
  }, []);  

  useEffect(() => {
    const fetchUserLocationWeather = async () => {
      if (!("geolocation" in navigator)) {
        console.error("Geolocation is not supported by this browser.");
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
  
          try {
            
            const geoRes = await fetch(`/api/weather/reverseGeocoding`,{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                }, body: JSON.stringify({lon:lon, lat:lat})
              }
            );
  
            const geoData = await geoRes.json();
            const city = geoData[0]?.name;
  
            if (!city) {
              console.warn("Could not determine city name from location.");
              return;
            }
  
           
            const weatherRes = await fetch(`/api/weather/currentWeather?city=${encodeURIComponent(city)}`, {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
  
            const weatherData = await weatherRes.json();
            if (weatherData.cod !== 200) {
              console.warn("Could not get weather for current location.");
              return;
            }
  
            
            const weatherObject = mapRealWeather(weatherData, "current-location"); // use special dbId
            setWeatherList((prev) => [weatherObject, ...prev]);
  
          } catch (error) {
            console.error("Error retrieving weather for user location:", error);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    };
  
    fetchUserLocationWeather();
  }, []);



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
        <Button colorScheme="red" variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Flex>

      {/* Input */}
      <VStack mb={6}>
        <Input
          placeholder="Enter city"
          width="300px"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button colorScheme="blue" onClick={getCurrentWeather}>
          Get Weather
        </Button>
      </VStack>

      {/* Weather Boxes */}
      <VStack  align="center">
      {weatherList.map((weather) => (
  <VStack key={weather.id} align="center" mb={10}>
    {/* Small Weather Card */}
    <Box
      p={4}
      bg="blackAlpha.600"
      borderRadius="xl"
      backdropFilter="blur(8px)"
      textAlign="center"
      position="relative"
      width="300px"
      boxShadow="lg"
    >
      <Box position="absolute" top="8px" left="8px" fontSize="2xl">
        {weatherIcons[weather.weather[0].main] || '❓'}
      </Box>

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
        onClick={() => removeWeather(weather.id, weather.dbId)}
        cursor="pointer"
      >
        ×
      </Box>

      <Text fontSize="xl" fontWeight="bold">
        {weather.name}, {weather.sys.country}
      </Text>
      <Text fontSize="2xl">
        {Math.round(weather.main.temp)}°F
      </Text>
      <Text>
        {weather.weather[0].main} - {weather.weather[0].description}
      </Text>
      <Text>Humidity: {weather.main.humidity}%</Text>
      <Text>Wind: {weather.wind.speed.toFixed(1)} m/s</Text>
    </Box>

    {/* Side-by-Side Layout */}
    <Flex
      direction={{ base: 'column', md: 'row' }}
      mt={6}
      gap={6}
      justify="center"
      align="stretch"
      width="100%"
      maxW="1500px"
    >
      {/* Map on the Left */}
      <Box
        borderRadius="xl"
        overflow="hidden"
        flex="1"
        minH="400px"
        boxShadow="lg"
        minW={{ base: '100%', md: '900px' }}
      >
        <iframe
          width="100%"
          height="100%"
          src={`https://embed.windy.com/embed2.html?lat=${weather.coord.lat}&lon=${weather.coord.lon}&detailLat=${weather.coord.lat}&detailLon=${weather.coord.lon}&width=650&height=450&zoom=6&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=true&metricWind=default&metricTemp=default&radarRange=-1`}
          frameBorder="0"
        ></iframe>
      </Box>

      {/* Large Detail Box on the Right */}
      <Flex
  p={6}
  bg="blackAlpha.600"
  borderRadius="2xl"
  backdropFilter="blur(10px)"
  flex="1"
  justify="space-between"
  align="center"
  position="relative"
  boxShadow="2xl"
  direction="column"
  minW={{ base: '100%', md: '900px' }}
>
  <Text fontSize="lg" fontWeight="semibold" alignSelf="flex-start">
    {new Date().toLocaleDateString(undefined, {
      weekday: 'long',
    })}
  </Text>

  <Text fontSize="2xl" fontWeight="bold" >
    {weather.name}, {weather.sys.country}
  </Text>

  {/* Big Temperature in the center */}
  <Text
    fontSize={{ base: '6xl', md: '8xl' }}
    fontWeight="extrabold"
    textAlign="center"
    mt={4}
    mb={2}
  >
    {Math.round(weather.main.temp)}°F
  </Text>

  {/* Weather Icon */}
  <Box fontSize="6xl" mt={2}>
    {weatherIcons[weather.weather[0].main] || '❓'}
  </Box>

  {/* Feels Like */}
  <Box position="absolute" bottom="12px" left="24px" fontSize="md">
    Feels like: {Math.round(weather.main.feels_like)}°F
  </Box>
</Flex>
    </Flex>
  </VStack>
        ))}
      </VStack>
    </Box>
  );
};

export default Weather;
