import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Textarea, Button, Text } from '@chakra-ui/react';
import { generateText } from '../services/content';
import toast from 'react-hot-toast';

const TranscriptGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedTranscript, setGeneratedTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await generateText('transcript', prompt);
      setGeneratedTranscript(data.text);
      toast.success('Transcript generated!');
    } catch (error) {
      toast.error('Failed to generate transcript.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4}>
        Generate Video Transcript
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="transcript-prompt" mb={4}>
          <FormLabel>Transcript Prompt</FormLabel>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A 30-second video ad about the benefits of our new subscription box."
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" isLoading={loading}>
          Generate Transcript
        </Button>
      </form>
      {generatedTranscript && (
        <Box mt={6} p={4} borderWidth={1} borderRadius="md" whiteSpace="pre-wrap">
          <Heading as="h4" size="md" mb={2}>
            Generated Transcript:
          </Heading>
          <Text>{generatedTranscript}</Text>
        </Box>
      )}
    </Box>
  );
};

export default TranscriptGenerator;