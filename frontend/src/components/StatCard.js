import { Box, Text, Heading, Icon } from '@chakra-ui/react';
import { glassmorphismStyle } from '../theme';

const StatCard = ({ title, value, icon }) => (
  <Box p={5} {...glassmorphismStyle}>
    <Icon as={icon} w={8} h={8} color="cyan.400" mb={4} />
    <Heading size="lg">{value}</Heading>
    <Text color="gray.400">{title}</Text>
  </Box>
);

export default StatCard;