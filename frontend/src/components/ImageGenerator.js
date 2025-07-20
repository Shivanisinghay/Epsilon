import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, Image, Spinner } from '@chakra-ui/react';
import { generateImage } from '../services/content';
import toast from 'react-hot-toast';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedImage('');
    try {
      const data = await generateImage(prompt);
      setGeneratedImage(data.image);
      toast.success('Image generated!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4}>
        Generate Image Ad
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="image-prompt" mb={4}>
          <FormLabel>Image Prompt</FormLabel>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A futuristic city with flying cars and neon lights."
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" isLoading={loading}>
          Generate Image
        </Button>
      </form>
      {loading && <Spinner mt={6} />}
      {generatedImage && (
        <Box mt={6}>
          <Heading as="h4" size="md" mb={2}>
            Generated Image:
          </Heading>
          <Image src={generatedImage} alt="Generated Ad" borderRadius="md" />
        </Box>
      )}
    </Box>
  );
};

export default ImageGenerator;