import { useState } from 'react';
import {
  Box, Heading, FormControl, FormLabel, Textarea, Button, Text, HStack, VStack,
  Card, CardHeader, CardBody, Divider
} from '@chakra-ui/react';
import { generateText, saveContent } from '../services/content';
import SocialShareButtons from './SocialShareButtons';
import toast from 'react-hot-toast';

const EmailGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedEmails, setGeneratedEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (variations = 1) => {
    if (!prompt) {
      toast.error("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setGeneratedEmails([]);
    try {
      const data = await generateText('email', prompt, variations);
      const emails = data.text.split('---VARIATION---').map(e => e.trim()).filter(e => e);
      setGeneratedEmails(emails);

      for (const email of emails) {
          await saveContent({ type: 'email', prompt, generatedContent: email });
      }
      toast.success(`${emails.length} email variation(s) generated!`);
    } catch (error) {
      toast.error('Failed to generate email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4}>
        Generate Marketing Email
      </Heading>
      <FormControl id="email-prompt" mb={4}>
        <FormLabel>Your Prompt</FormLabel>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A new product launch for our new line of eco-friendly sneakers."
          required
          size="lg"
        />
      </FormControl>
      <HStack>
        <Button onClick={() => handleGenerate(1)} isLoading={loading} loadingText="Generating...">
          Generate Email
        </Button>
        <Button onClick={() => handleGenerate(3)} variant="outline" colorScheme="cyan" isLoading={loading} loadingText="Generating...">
          A/B Test (3 Variations)
        </Button>
      </HStack>

      {generatedEmails.length > 0 && (
        <VStack mt={8} spacing={6} align="stretch">
          <Heading as="h4" size="md">Generated Content:</Heading>
          {generatedEmails.map((email, index) => (
            <Card key={index}>
              <CardHeader>
                <Heading size="sm">Variation {index + 1}</Heading>
              </CardHeader>
              <CardBody>
                <Text whiteSpace="pre-wrap" color="gray.300">{email}</Text>
                <Divider my={4} borderColor="whiteAlpha.300" />
                <SocialShareButtons content={email} />
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default EmailGenerator;