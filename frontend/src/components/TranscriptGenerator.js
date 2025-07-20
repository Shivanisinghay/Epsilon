import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Textarea, Button, Text, HStack, VStack, Divider } from '@chakra-ui/react';
import { generateText, saveContent } from '../services/content';
import SocialShareButtons from './SocialShareButtons';
import toast from 'react-hot-toast';

const TranscriptGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedTranscripts, setGeneratedTranscripts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (variations = 1) => {
    if (!prompt) {
      toast.error("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setGeneratedTranscripts([]);
    try {
      const data = await generateText('transcript', prompt, variations);
      const transcripts = data.text.split('---VARIATION---').map(t => t.trim());
      setGeneratedTranscripts(transcripts);

      // Save each variation to history
      for (const transcript of transcripts) {
        if (transcript) {
          await saveContent({ type: 'transcript', prompt, generatedContent: transcript });
        }
      }
      toast.success(`${variations} transcript(s) generated!`);
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
      <FormControl id="transcript-prompt" mb={4}>
        <FormLabel>Transcript Prompt</FormLabel>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A 30-second video ad about the benefits of our new subscription box."
          required
        />
      </FormControl>
      <HStack>
        <Button onClick={() => handleGenerate(1)} colorScheme="teal" isLoading={loading} loadingText="Generating...">
          Generate Transcript
        </Button>
        <Button onClick={() => handleGenerate(3)} colorScheme="blue" isLoading={loading} loadingText="Generating...">
          A/B Test (3 Variations)
        </Button>
      </HStack>

      {generatedTranscripts.length > 0 && (
        <VStack mt={6} spacing={4} align="stretch">
          <Heading as="h4" size="md">Generated Content:</Heading>
          {generatedTranscripts.map((transcript, index) => (
            <Box key={index} p={4} borderWidth={1} borderRadius="md" whiteSpace="pre-wrap" boxShadow="sm">
              <Heading as="h5" size="sm" mb={2}>Variation {index + 1}</Heading>
              <Text>{transcript}</Text>
              <SocialShareButtons content={transcript} />
              <Divider my={2} />
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default TranscriptGenerator;