import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Heading, FormControl, FormLabel, Input, Button, Text, VStack, Icon, Flex } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { FaBolt } from 'react-icons/fa';
import { glassmorphismStyle } from '../theme';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Flex minH="100vh" w="full" align="center" justify="center">
        <Box maxW="md" w="100%" p={8} {...glassmorphismStyle}>
        <VStack spacing={4} align="center">
            <Icon as={FaBolt} w={10} h={10} color="cyan.400" />
            <Heading as="h1" size="lg" textAlign="center">Enter the Future</Heading>
            <Text color="gray.400">Login to continue to OmniOrchestrator</Text>
        </VStack>
        <form onSubmit={handleSubmit}>
            <VStack spacing={4} mt={8}>
            <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </FormControl>
            <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </FormControl>
            <Button type="submit" width="full" mt={4}>Login</Button>
            </VStack>
        </form>
        <Text mt={6} textAlign="center" fontSize="sm">
            Don't have an account?{' '}
            <Button as={Link} to="/register" variant="link" colorScheme="cyan">Register here</Button>
        </Text>
        </Box>
    </Flex>
  );
};

export default Login;