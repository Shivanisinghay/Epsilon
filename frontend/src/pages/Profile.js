import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box, Heading, FormControl, FormLabel, Input, Button, VStack, Textarea,
  Avatar, HStack, Select, useToast
} from '@chakra-ui/react';
import { updateUser, uploadProfilePicture } from '../services/auth';
import { glassmorphismStyle } from '../theme';

const Profile = () => {
  const { user, setUser } = useAuth();
  const toast = useToast();
  
  const [formData, setFormData] = useState({});
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (user) {
      // The new URL points to our database serving endpoint
      // The timestamp is crucial to prevent browser caching
      const newAvatarUrl = `${process.env.REACT_APP_BACKEND_URL}/api/user/avatar/${user._id}?t=${new Date().getTime()}`;
      setAvatarUrl(newAvatarUrl);

      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('profilePicture', file);

    try {
      const updatedUser = await uploadProfilePicture(uploadData);
      setUser(updatedUser); // Update global context
      toast({ title: 'Profile picture updated!', status: 'success', isClosable: true });
    } catch (error) {
      toast({ title: 'Upload Failed', description: error.response?.data?.error || 'Please check the file.', status: 'error', isClosable: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUser(formData);
      setUser(updatedUser);
      toast({ title: 'Profile saved successfully!', status: 'success', isClosable: true });
    } catch (error) {
      toast({ title: 'Save Failed', description: error.response?.data?.error || 'Please check your details.', status: 'error', isClosable: true });
    }
  };

  return (
    <Box maxW="container.md" w="100%" p={8} {...glassmorphismStyle}>
      <Heading as="h1" size="xl" mb={8} textAlign="center">Edit Profile</Heading>
      <VStack as="form" onSubmit={handleSubmit} spacing={6} align="stretch">
        
        <FormControl>
          <FormLabel>Profile Picture</FormLabel>
          <HStack spacing={4}>
            <Avatar size="xl" name={user?.name} src={avatarUrl} />
            <Button onClick={() => fileInputRef.current.click()}>Change Picture</Button>
            <Input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
          </HStack>
        </FormControl>

        <FormControl isRequired><FormLabel>Full Name</FormLabel><Input name="name" value={formData.name} onChange={handleChange} /></FormControl>
        <FormControl><FormLabel>Username</FormLabel><Input name="username" value={formData.username} onChange={handleChange} /></FormControl>
        <FormControl isRequired><FormLabel>Email Address</FormLabel><Input type="email" name="email" value={formData.email} onChange={handleChange} /></FormControl>
        <FormControl><FormLabel>Phone Number (Optional)</FormLabel><Input type="tel" name="phone" value={formData.phone} /></FormControl>
        <FormControl><FormLabel>Date of Birth</FormLabel><Input type="date" name="dob" value={formData.dob} /></FormControl>
        <FormControl><FormLabel>Gender</FormLabel>
          <Select name="gender" value={formData.gender} onChange={handleChange} placeholder="Select gender">
            <option value="Male">Male</option> <option value="Female">Female</option>
            <option value="Other">Other</option> <option value="Prefer not to say">Prefer not to say</option>
          </Select>
        </FormControl>
        <FormControl><FormLabel>Bio / About Me</FormLabel><Textarea name="bio" value={formData.bio} onChange={handleChange} /></FormControl>
        
        <Button type="submit" mt={4} size="lg">Save Changes</Button>
      </VStack>
    </Box>
  );
};

export default Profile;