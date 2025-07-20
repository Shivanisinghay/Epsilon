import { Box, Flex, Heading, Button, Spacer } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Flex p={4} bg="teal.500" color="white" alignItems="center">
      <Heading as={Link} to="/" size="md">
        Epsilon
      </Heading>
      <Spacer />
      <Box>
        {user ? (
          <>
            <Button as={Link} to="/dashboard" variant="ghost" mr={4}>
              Dashboard
            </Button>
            <Button onClick={handleLogout} colorScheme="teal" variant="outline">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button as={Link} to="/login" variant="ghost" mr={4}>
              Login
            </Button>
            <Button as={Link} to="/register" colorScheme="teal" variant="outline">
              Register
            </Button>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default Navbar;