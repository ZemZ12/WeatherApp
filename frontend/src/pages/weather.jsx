import React from 'react';
import { Box, Heading, Input, Button, VStack, Text } from '@chakra-ui/react';

const Weather = () => {
  return (
    <Box p={8}>
      <Heading mb={4}>Weather App</Heading>
      <VStack spacing={4}>
        <Input placeholder="Enter city" width="300px" />
        <Button colorScheme="blue">Get Weather</Button>
        <Text mt={4}>Weather details will show here.</Text>
      </VStack>
    </Box>
  );
};

export default Weather;