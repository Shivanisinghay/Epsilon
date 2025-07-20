import React, { useState } from 'react';
import {
  Box, Heading, VStack, FormControl, FormLabel, Textarea, Button, HStack, Icon, useToast
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { submitReview } from '../services/reviews';
import { glassmorphismStyle } from '../theme';

const ReviewForm = ({ onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please provide a rating and a comment.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      await submitReview({ rating, comment });
      toast({
        title: 'Review submitted!',
        description: 'Thank you for your feedback.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setComment('');
      setRating(0);
      onReviewSubmitted(); // Refresh the reviews list
    } catch (error) {
      // THIS IS THE NEW LOGGING CODE
      console.error("Review submission failed:", error.response || error);
      
      toast({
        title: 'Submission failed',
        description: error.response?.data?.msg || 'Could not submit your review.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w="100%" p={6} {...glassmorphismStyle}>
      <Heading size="lg" mb={4}>Share Your Feedback</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Your Rating</FormLabel>
            <HStack spacing={1}>
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <Icon
                    as={FaStar}
                    key={ratingValue}
                    boxSize={6}
                    color={ratingValue <= (hover || rating) ? 'yellow.400' : 'gray.500'}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                    cursor="pointer"
                    transition="color 0.2s"
                  />
                );
              })}
            </HStack>
          </FormControl>
          <FormControl>
            <FormLabel>Your Comments</FormLabel>
            <Textarea
              placeholder="Tell us what you think about the platform..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              bg="whiteAlpha.200"
              border="none"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="cyan"
            isLoading={loading}
          >
            Submit Review
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ReviewForm;