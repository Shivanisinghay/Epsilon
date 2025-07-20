import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Textarea, Button, Text } from '@chakra-ui/react';
import { generateText } from '../services/content';
import toast from 'react-hot-toast';

const EmailGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await generateText('email', prompt);
      setGeneratedEmail(data.text);
      toast.success('Email generated!');
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
      <form onSubmit={handleSubmit}>
        <FormControl id="email-prompt" mb={4}>
          <FormLabel>Email Prompt</FormLabel>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A new product launch for our new line of eco-friendly sneakers."
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" isLoading={loading}>
          Generate Email
        </Button>
      </form>
      {generatedEmail && (
        <Box mt={6} p={4} borderWidth={1} borderRadius="md" whiteSpace="pre-wrap">
          <Heading as="h4" size="md" mb={2}>
            Generated Email:
          </Heading>
          <Text>{generatedEmail}</Text>
        </Box>
      )}
    </Box>
  );
};

export default EmailGenerator;