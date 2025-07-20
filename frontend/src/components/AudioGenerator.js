import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Textarea, Button, Spinner } from '@chakra-ui/react';
import { generateAudio } from '../services/content';
import toast from 'react-hot-toast';

const AudioGenerator = () => {
  const [text, setText] = useState('');
  const [audioPath, setAudioPath] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAudioPath('');
    try {
      const data = await generateAudio(text);
      setAudioPath(data.audioPath);
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
          <FormLabel>Ad Script</FormLabel>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the script for the audio ad..."
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" isLoading={loading}>
          Generate Audio
        </Button>
      </form>
      {loading && <Spinner mt={6} />}
      {audioPath && (
        <Box mt={6}>
          <Heading as="h4" size="md" mb={2}>
            Generated Audio:
          </Heading>
          <audio controls src={`${process.env.REACT_APP_BACKEND_URL}${audioPath}`}>
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}
    </Box>
  );
};

export default AudioGenerator;