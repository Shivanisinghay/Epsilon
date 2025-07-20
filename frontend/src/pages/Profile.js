import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Heading, FormControl, FormLabel, Input, Button, VStack } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { updateUser } from '../services/auth';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUser({ name, email });
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
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
          <Button type="submit" colorScheme="teal" width="full">
            Update Profile
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Profile;