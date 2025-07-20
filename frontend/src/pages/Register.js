import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Heading, FormControl, FormLabel, Input, Button, Text, VStack, Icon } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { FaUserPlus } from 'react-icons/fa';
import { glassmorphismStyle } from '../theme';

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
       if (error.response?.data?.details) {
        toast.error(error.response.data.details.map(err => err.msg).join('\n'));
      } else {
        toast.error(error.response?.data?.error || 'Registration failed');
      }
    }
  };

  return (
     <Box maxW="md" w="100%" p={8} {...glassmorphismStyle}>
       <VStack spacing={4} align="center">
        <Icon as={FaUserPlus} w={10} h={10} color="cyan.400" />
        <Heading as="h1" size="lg" textAlign="center">Create an Account</Heading>
      </VStack>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} mt={8}>
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
          </FormControl>
          <Button type="submit" width="full" mt={4}>Register</Button>
        </VStack>
      </form>
       <Text mt={6} textAlign="center" fontSize="sm">
        Already have an account?{' '}
        <Button as={Link} to="/login" variant="link" colorScheme="cyan">Login here</Button>
      </Text>
    </Box>
  );
};

export default Register;