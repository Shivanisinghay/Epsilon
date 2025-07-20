import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Heading, FormControl, FormLabel, Input, Button, VStack, FormHelperText } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { updateUser } from '../services/auth';
import { glassmorphismStyle } from '../theme';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    try {
      const updatedData = { name, email };
      if (password) {
        updatedData.password = password;
      }
      const updatedUser = await updateUser(updatedData);
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      setPassword('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
    }
  };

  return (
    <Box maxW="md" w="100%" p={8} {...glassmorphismStyle}>
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Profile Settings
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
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
            <FormHelperText>Must be at least 8 characters long.</FormHelperText>
          </FormControl>
          <Button type="submit" width="full">
            Update Profile
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Profile;