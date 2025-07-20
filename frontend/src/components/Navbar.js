import { Box, Flex, Heading, Button, Spacer, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Flex p={4} bg="teal.500" color="white" alignItems="center" boxShadow="md">
      <Heading as={Link} to="/" size="md">
        Epsilon
      </Heading>
      <Spacer />
      <Box>
        {user ? (
          <Menu>
            <MenuButton as={Button} colorScheme="teal" variant="ghost" leftIcon={<FaUserCircle />}>
              {user.name}
            </MenuButton>
            <MenuList bg="white" color="black">
              <MenuItem as={Link} to="/dashboard">Dashboard</MenuItem>
              <MenuItem as={Link} to="/profile">Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <>
            <Button as={Link} to="/login" variant="ghost" mr={4}>
              Login
            </Button>
            <Button as={Link} to="/register" colorScheme="teal" variant="outline" _hover={{ bg: "teal.600" }}>
              Register
            </Button>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default Navbar;