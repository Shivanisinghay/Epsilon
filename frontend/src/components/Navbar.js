import { Box, Flex, Heading, Button, Spacer, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBolt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Flex
      as="nav"
      p={4}
      bg="rgba(10, 10, 25, 0.5)"
      backdropFilter="blur(10px)"
      color="white"
      alignItems="center"
      borderBottom="1px"
      borderColor="whiteAlpha.200"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Flex as={Link} to="/" alignItems="center" _hover={{ textDecoration: 'none' }}>
        <FaBolt color="cyan" />
        <Heading size="md" ml={2} letterSpacing="tight">
          OmniOrchestrator
        </Heading>
      </Flex>
      <Spacer />
      <Box>
        {user ? (
          <>
            <Button as={Link} to="/dashboard" variant="ghost" mr={4}>
              Dashboard
            </Button>
            <Button onClick={handleLogout} variant="outline" colorScheme="purple">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button as={Link} to="/login" variant="ghost" mr={4}>
              Login
            </Button>
            <Button as={Link} to="/register" variant="solid">
              Register
            </Button>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default Navbar;