import { Box, Heading, Text, Button, VStack, Container } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxW="container.md" textAlign="center" mt="10vh">
      <VStack spacing={6}>
        <Heading as="h1" size={{ base: '2xl', md: '4xl' }} bgGradient="linear(to-r, cyan.400, blue.500, purple.600)" bgClip="text">
          Unleash Your Marketing Potential
        </Heading>
        <Text fontSize={{ base: 'lg', md: '2xl' }} color="gray.300" maxW="2xl">
          OmniOrchestrator is your AI-powered co-pilot for creating high-impact marketing content in seconds, not hours.
        </Text>
        <Button as={Link} to="/register" size="lg" px={8} py={6}>
          Get Started for Free
        </Button>
      </VStack>
    </Container>
  );
};

export default Home;