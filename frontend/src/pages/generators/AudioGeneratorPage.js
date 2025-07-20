import EmailGenerator from '../../components/AudioGenerator';
import { glassmorphismStyle } from '../../theme';
import { Box, Heading } from '@chakra-ui/react';

const AudioGeneratorPage = () => (
  <Box p={{ base: 4, md: 8 }} w="100%" {...glassmorphismStyle}>
      <Heading as="h1" size="xl" mb={8} bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text">
        AI Email Generator
      </Heading>
      <EmailGenerator />
  </Box>
);

export default AudioGeneratorPage;