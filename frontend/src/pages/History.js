import { useEffect, useState } from 'react';
import { Box, Heading, Text, VStack, Spinner, Card, CardBody } from '@chakra-ui/react';
import { getContentHistory } from '../services/content';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getContentHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4}>
        Content History
      </Heading>
      <VStack spacing={4} align="stretch">
        {history.length > 0 ? (
          history.map((item) => (
            <Card key={item._id}>
              <CardBody>
                <Text fontWeight="bold">Type: {item.type}</Text>
                <Text>Prompt: {item.prompt}</Text>
                <Text>Generated: {item.generatedContent}</Text>
              </CardBody>
            </Card>
          ))
        ) : (
          <Text>No history found.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default History;