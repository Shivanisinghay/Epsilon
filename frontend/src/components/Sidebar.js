import {
  Box, Flex, VStack, Heading, Text, Link, Menu, MenuButton, MenuList, MenuItem, Avatar,
  Icon, Divider, useBreakpointValue, IconButton
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    FaBolt, FaThLarge, FaUserEdit, FaSignOutAlt, FaBars, FaTimes, 
    FaEnvelope, FaBell, FaFileAlt, FaImage, FaVolumeUp, FaHistory 
} from 'react-icons/fa';
import { useState } from 'react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navSize = isMobile && !isNavOpen ? 'closed' : 'large';

  const NavContent = () => (
    <VStack as="nav" spacing={2} align="stretch" h="100%" p={4}>
      <Flex as={NavLink} to="/" alignItems="center" _hover={{ textDecoration: 'none' }} p={2} mb={6}>
        <Icon as={FaBolt} w={8} h={8} color="cyan.400" />
        {navSize === 'large' && <Heading size="md" ml={2}>Epsilon</Heading>}
      </Flex>

      <VStack spacing={2} align="stretch" flex="1">
        <NavItem to="/dashboard" icon={FaThLarge} text="Dashboard" />
        <Text fontSize="sm" color="gray.500" pl={3} mt={4} mb={2}>TOOLS</Text>
        <NavItem to="/generate/email" icon={FaEnvelope} text="Email Generator" />
        <NavItem to="/generate/notification" icon={FaBell} text="Notification Generator" />
        <NavItem to="/generate/transcript" icon={FaFileAlt} text="Transcript Generator" />
        <NavItem to="/generate/image" icon={FaImage} text="Image Generator" />
        <NavItem to="/generate/audio" icon={FaVolumeUp} text="Audio Generator" />
        <NavItem to="/history" icon={FaHistory} text="Content History" />
      </VStack>

      {user && (
        <Box>
            <Divider my={4} borderColor="whiteAlpha.300" />
            <Menu placement="top-end">
                <MenuButton w="100%">
                    <Flex alignItems="center" p={2} borderRadius="md" _hover={{ bg: 'whiteAlpha.200' }}>
                        <Avatar size="sm" name={user.name} />
                        {navSize === 'large' && (
                        <Box ml={3} textAlign="left">
                            <Text fontWeight="bold">{user.name}</Text>
                            <Text fontSize="xs" color="gray.400">{user.email}</Text>
                        </Box>
                        )}
                    </Flex>
                </MenuButton>
                <MenuList bg="gray.800" borderColor="whiteAlpha.300">
                    <MenuItem icon={<Icon as={FaUserEdit} />} onClick={() => navigate('/profile')} bg="gray.800" _hover={{ bg: 'whiteAlpha.100' }}>
                        Edit Profile
                    </MenuItem>
                    <MenuItem icon={<Icon as={FaSignOutAlt} />} onClick={handleLogout} bg="gray.800" _hover={{ bg: 'whiteAlpha.100' }}>
                        Logout
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
      )}
    </VStack>
  );

  return isMobile ? (
    <>
      <IconButton icon={isNavOpen ? <FaTimes /> : <FaBars />} onClick={() => setIsNavOpen(!isNavOpen)}
        position="fixed" top={4} left={4} zIndex="overlay" bg="gray.800" _hover={{ bg: "gray.700" }}/>
      <Flex pos="fixed" top="0" left="0" h="100vh" w={isNavOpen ? '250px' : '0'} bg="rgba(10, 10, 25, 0.8)"
        backdropFilter="blur(10px)" borderRight="1px" borderColor="whiteAlpha.200" transition="width 0.2s"
        direction="column" overflow="hidden" zIndex="sticky">
        <NavContent />
      </Flex>
    </>
  ) : (
    <Flex pos="sticky" top="0" left="0" h="100vh" w="250px" bg="rgba(10, 10, 25, 0.5)" backdropFilter="blur(10px)"
      borderRight="1px" borderColor="whiteAlpha.200" direction="column">
      <NavContent />
    </Flex>
  );
};

const NavItem = ({ to, icon, text }) => (
  <Link as={NavLink} to={to} p={3} borderRadius="md" _hover={{ bg: 'whiteAlpha.200', textDecoration: 'none' }}
    _activeLink={{ bg: 'cyan.400', color: 'gray.900' }}>
    <Flex align="center">
      <Icon as={icon} w={5} h={5} />
      <Text ml={4}>{text}</Text>
    </Flex>
  </Link>
);

export default Sidebar;