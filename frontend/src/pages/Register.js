import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box, Heading, FormControl, FormLabel, Input, Button, Text,
  FormHelperText, VStack, List, ListItem, ListIcon
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      // Handle detailed validation errors from backend
      if (error.response?.data?.details) {
        const errorMessages = error.response.data.details.map(err => err.msg).join('\n');
        toast.error(errorMessages, { duration: 5000 });
      } else {
        toast.error(error.response?.data?.error || 'Registration failed');
      }
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Register
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <FormHelperText>
              <List spacing={1} mt={2} fontSize="sm" color="gray.600">
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  At least 8 characters long.
                </ListItem>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Contains an uppercase letter.
                </ListItem>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Contains a lowercase letter.
                </ListItem>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Contains a number.
                </ListItem>
                 <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Contains a special character (@$!%*?&).
                </ListItem>
              </List>
            </FormHelperText>
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full">
            Register
          </Button>
        </VStack>
      </form>
      <Text mt={4} textAlign="center">
        Already have an account?{' '}
        <Button variant="link" colorScheme="teal" onClick={() => navigate('/login')}>
          Login
        </Button>
      </Text>
    </Box>
  );
};

export default Register;