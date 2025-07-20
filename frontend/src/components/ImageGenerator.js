import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, Image, Spinner, HStack, RadioGroup, Radio, VStack, Text } from '@chakra-ui/react';
import { generateImage, saveContent } from '../services/content';
import SocialShareButtons from './SocialShareButtons';
import toast from 'react-hot-toast';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedImage(null);

    const dimensions = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1024, height: 576 },
      '9:16': { width: 576, height: 1024 },
    };
    const { width, height } = dimensions[aspectRatio];

    try {
      const data = await generateImage(prompt, width, height);
      setGeneratedImage({
        base64: data.image,
        url: `${process.env.REACT_APP_BACKEND_URL}${data.imageUrl}`,
      });
      await saveContent({
        type: 'image',
        prompt: `[${aspectRatio}] ${prompt}`,
        generatedContent: data.imageUrl,
      });
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
        <VStack spacing={4} align="stretch">
          <FormControl id="image-prompt">
            <FormLabel>Your Prompt</FormLabel>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A futuristic city with flying cars and neon lights."
              required
              size="lg"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Frame Size</FormLabel>
            <RadioGroup onChange={setAspectRatio} value={aspectRatio}>
              <HStack spacing="24px">
                <Radio value="1:1">Square (1:1)</Radio>
                <Radio value="16:9">Landscape (16:9)</Radio>
                <Radio value="9:16">Portrait (9:16)</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <Button type="submit" isLoading={loading} loadingText="Generating...">
            Generate Image
          </Button>
        </VStack>
      </form>

      {loading && (
        <Box textAlign="center" mt={8}>
            <Spinner size="xl" color="cyan.400"/>
            <Text mt={4}>Generating your image, this may take a moment...</Text>
        </Box>
      )}

      {generatedImage && (
        <Box mt={8}>
          <Heading as="h4" size="md" mb={2}>
            Generated Image:
          </Heading>
          <Image src={generatedImage.base64} alt="Generated Ad" borderRadius="lg" maxW="512px" />
          <SocialShareButtons
            content={`Check out this image I generated: ${prompt}`}
            imageUrl={generatedImage.url}
          />
        </Box>
      )}
    </Box>
  );
};

export default ImageGenerator;