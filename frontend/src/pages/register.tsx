import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  Stack,
} from "@chakra-ui/react";

import {
    FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";

// Define type for form data
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

// Define type for errors
interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();
      if (response.ok) setMessage("Registration Successful!");
      else setMessage(data.error);
    } catch (error) {
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <Box height="100vh" width="100vw" backgroundImage="url(/rrt2.jpg)" backgroundSize="cover" display="flex" justifyContent="center" alignItems="center">
      <Box maxW="md" mx="auto" width="100%" backdropFilter="blur(25px)" p={6} borderWidth={1} borderRadius="md">
        <Heading as="h2" color="Black" size="lg" mb={6}>Register</Heading>
        {message && <Box color="green.500" mb={4}>{message}</Box>}

        <form onSubmit={handleSubmit}>
          <Stack>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="teal" width="full">Register</Button>
        
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default Register;
