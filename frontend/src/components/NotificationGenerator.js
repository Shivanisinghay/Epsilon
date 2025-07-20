import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, Text, HStack, VStack, Divider } from '@chakra-ui/react';
import { generateText, saveContent } from '../services/content';
import SocialShareButtons from './SocialShareButtons';
import toast from 'react-hot-toast';

const NotificationGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedNotifications, setGeneratedNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (variations = 1) => {
    if (!prompt) {
      toast.error("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setGeneratedNotifications([]);
    try {
      const data = await generateText('notification', prompt, variations);
      const notifications = data.text.split('---VARIATION---').map(n => n.trim());
      setGeneratedNotifications(notifications);

      // Save each variation to history
      for (const notification of notifications) {
        if (notification) {
          await saveContent({ type: 'notification', prompt, generatedContent: notification });
        }
      }
      toast.success(`${variations} notification(s) generated!`);
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
      <FormControl id="notification-prompt" mb={4}>
        <FormLabel>Notification Prompt</FormLabel>
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A 24-hour flash sale on all summer apparel."
          required
        />
      </FormControl>
      <HStack>
        <Button onClick={() => handleGenerate(1)} colorScheme="teal" isLoading={loading} loadingText="Generating...">
          Generate Notification
        </Button>
        <Button onClick={() => handleGenerate(3)} colorScheme="blue" isLoading={loading} loadingText="Generating...">
          A/B Test (3 Variations)
        </Button>
      </HStack>

      {generatedNotifications.length > 0 && (
        <VStack mt={6} spacing={4} align="stretch">
          <Heading as="h4" size="md">Generated Content:</Heading>
          {generatedNotifications.map((notification, index) => (
            <Box key={index} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
              <Heading as="h5" size="sm" mb={2}>Variation {index + 1}</Heading>
              <Text>{notification}</Text>
              <SocialShareButtons content={notification} />
              <Divider my={2} />
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default NotificationGenerator;