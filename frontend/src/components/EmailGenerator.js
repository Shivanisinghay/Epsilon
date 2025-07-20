import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Textarea, Button, Text, HStack, VStack, Divider } from '@chakra-ui/react';
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
      const emails = data.text.split('---VARIATION---').map(e => e.trim());
      setGeneratedEmails(emails);

      // Save each variation to history
      for (const email of emails) {
        if (email) {
          await saveContent({ type: 'email', prompt, generatedContent: email });
        }
      }
      toast.success(`${variations} email(s) generated!`);
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
        <FormLabel>Email Prompt</FormLabel>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A new product launch for our new line of eco-friendly sneakers."
          required
        />
      </FormControl>
      <HStack>
        <Button onClick={() => handleGenerate(1)} colorScheme="teal" isLoading={loading} loadingText="Generating...">
          Generate Email
        </Button>
        <Button onClick={() => handleGenerate(3)} colorScheme="blue" isLoading={loading} loadingText="Generating...">
          A/B Test (3 Variations)
        </Button>
      </HStack>

      {generatedEmails.length > 0 && (
        <VStack mt={6} spacing={4} align="stretch">
          <Heading as="h4" size="md">Generated Content:</Heading>
          {generatedEmails.map((email, index) => (
            <Box key={index} p={4} borderWidth={1} borderRadius="md" whiteSpace="pre-wrap" boxShadow="sm">
              <Heading as="h5" size="sm" mb={2}>Variation {index + 1}</Heading>
              <Text>{email}</Text>
              <SocialShareButtons content={email} />
              <Divider my={2} />
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default EmailGenerator;