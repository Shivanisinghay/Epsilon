import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, Text, HStack, VStack, Card, CardHeader, CardBody, Divider } from '@chakra-ui/react';
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
      const notifications = data.text.split('---VARIATION---').map(n => n.trim()).filter(n => n);
      setGeneratedNotifications(notifications);

      for (const notification of notifications) {
        await saveContent({ type: 'notification', prompt, generatedContent: notification });
      }
      toast.success(`${notifications.length} notification variation(s) generated!`);
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
        <FormLabel>Your Prompt</FormLabel>
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A 24-hour flash sale on all summer apparel."
          required
          size="lg"
        />
      </FormControl>
      <HStack>
        <Button onClick={() => handleGenerate(1)} isLoading={loading} loadingText="Generating...">
          Generate Notification
        </Button>
        <Button onClick={() => handleGenerate(3)} variant="outline" colorScheme="cyan" isLoading={loading} loadingText="Generating...">
          A/B Test (3 Variations)
        </Button>
      </HStack>

      {generatedNotifications.length > 0 && (
        <VStack mt={8} spacing={6} align="stretch">
          <Heading as="h4" size="md">Generated Content:</Heading>
          {generatedNotifications.map((notification, index) => (
            <Card key={index}>
              <CardHeader>
                <Heading size="sm">Variation {index + 1}</Heading>
              </CardHeader>
              <CardBody>
                <Text color="gray.300">{notification}</Text>
                <Divider my={4} borderColor="whiteAlpha.300" />
                <SocialShareButtons content={notification} />
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default NotificationGenerator;