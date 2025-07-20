import { Box, Text, Avatar, HStack, VStack } from '@chakra-ui/react';
import { glassmorphismStyle } from '../theme';

const ReviewCard = ({ name, title, comment, avatar }) => (
  <Box p={6} {...glassmorphismStyle}>
    <VStack align="start" spacing={4}>
      <HStack>
        <Avatar name={name} src={avatar} />
        <Box>
          <Text fontWeight="bold">{name}</Text>
          <Text fontSize="sm" color="gray.400">{title}</Text>
        </Box>
      </HStack>
      <Text fontStyle="italic">"{comment}"</Text>
    </VStack>
  </Box>
);

export default ReviewCard;