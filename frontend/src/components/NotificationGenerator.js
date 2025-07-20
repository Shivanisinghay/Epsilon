import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, Text } from '@chakra-ui/react';
import { generateText } from '../services/content';
import toast from 'react-hot-toast';

const NotificationGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedNotification, setGeneratedNotification] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await generateText('notification', prompt);
      setGeneratedNotification(data.text);
      toast.success('Notification generated!');
    } catch (error) {
      toast.error('Failed to generate notification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4}>
        Generate Marketing Notification
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="notification-prompt" mb={4}>
          <FormLabel>Notification Prompt</FormLabel>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A 24-hour flash sale on all summer apparel."
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" isLoading={loading}>
          Generate Notification
        </Button>
      </form>
      {generatedNotification && (
        <Box mt={6} p={4} borderWidth={1} borderRadius="md">
          <Heading as="h4" size="md" mb={2}>
            Generated Notification:
          </Heading>
          <Text>{generatedNotification}</Text>
        </Box>
      )}
    </Box>
  );
};

export default NotificationGenerator;