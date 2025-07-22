import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Textarea, Button, Spinner, Text } from '@chakra-ui/react';
import { generateAudio, saveContent } from '../services/content';
import SocialShareButtons from './SocialShareButtons';
import toast from 'react-hot-toast';

const AudioGenerator = () => {
  const [text, setText] = useState('');
  const [audioDataUrl, setAudioDataUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAudioDataUrl('');
    try {
      const data = await generateAudio(text);
      setAudioDataUrl(data.audio_base64);
      await saveContent({
          type: 'audio',
          prompt: text,
          generatedContent: data.audioPath
      });
      toast.success('Audio generated!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate audio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4}>
        Generate Audio Ad
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="audio-text" mb={4}>
          <FormLabel>Your Script</FormLabel>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the script for the audio ad..."
            required
            size="lg"
          />
        </FormControl>
        <Button type="submit" isLoading={loading} loadingText="Generating...">
          Generate Audio
        </Button>
      </form>

      {loading && (
        <Box textAlign="center" mt={8}>
          <Spinner size="xl" color="cyan.400"/>
          <Text mt={4}>Generating audio...</Text>
        </Box>
      )}

      {audioDataUrl && (
        <Box mt={8}>
          <Heading as="h4" size="md" mb={2}>
            Generated Audio:
          </Heading>
          <audio controls src={audioDataUrl} style={{ filter: 'invert(1)' }}>
            Your browser does not support the audio element.
          </audio>
          <SocialShareButtons
            content={`Listen to this audio ad I generated: ${text}`}
            url={audioDataUrl}
          />
        </Box>
      )}
    </Box>
  );
};

export default AudioGenerator;