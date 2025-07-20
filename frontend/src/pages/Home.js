import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" size="2xl" mb={4}>
        Welcome to Epsilon
      </Heading>
      <Text fontSize="xl" color="gray.500" mb={8}>
        AI-Powered Marketing Content Generation
      </Text>
      <VStack spacing={4}>
        <Button as={Link} to="/register" colorScheme="teal" size="lg">
          Get Started
        </Button>
        <Button as={Link} to="/login" variant="outline" colorScheme="teal" size="lg">
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Home;