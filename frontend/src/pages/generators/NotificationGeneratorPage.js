import NotificationGenerator from '../../components/NotificationGenerator';
import { glassmorphismStyle } from '../../theme';
import { Box, Heading } from '@chakra-ui/react';

const NotificationGeneratorPage = () => (
  <Box p={{ base: 4, md: 8 }} w="100%" {...glassmorphismStyle}>
      <Heading as="h1" size="xl" mb={8} bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text">
        AI Notification Generator
      </Heading>
      <NotificationGenerator />
  </Box>
);

export default NotificationGeneratorPage;