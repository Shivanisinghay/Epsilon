import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Textarea, Button, Text, HStack, VStack, Card, CardHeader, CardBody, Divider } from '@chakra-ui/react';
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
      const transcripts = data.text.split('---VARIATION---').map(t => t.trim()).filter(t => t);
      setGeneratedTranscripts(transcripts);

      for (const transcript of transcripts) {
        await saveContent({ type: 'transcript', prompt, generatedContent: transcript });
      }
      toast.success(`${transcripts.length} transcript variation(s) generated!`);
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
        <FormLabel>Your Prompt</FormLabel>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A 30-second video ad about the benefits of our new subscription box."
          required
          size="lg"
        />
      </FormControl>
      <HStack>
        <Button onClick={() => handleGenerate(1)} isLoading={loading} loadingText="Generating...">
          Generate Transcript
        </Button>
        <Button onClick={() => handleGenerate(3)} variant="outline" colorScheme="cyan" isLoading={loading} loadingText="Generating...">
          A/B Test (3 Variations)
        </Button>
      </HStack>

      {generatedTranscripts.length > 0 && (
        <VStack mt={8} spacing={6} align="stretch">
          <Heading as="h4" size="md">Generated Content:</Heading>
          {generatedTranscripts.map((transcript, index) => (
            <Card key={index}>
              <CardHeader>
                <Heading size="sm">Variation {index + 1}</Heading>
              </CardHeader>
              <CardBody>
                <Text whiteSpace="pre-wrap" color="gray.300">{transcript}</Text>
                <Divider my={4} borderColor="whiteAlpha.300" />
                <SocialShareButtons content={transcript} />
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default TranscriptGenerator;