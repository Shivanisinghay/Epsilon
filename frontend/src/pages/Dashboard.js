import { useEffect, useState } from 'react';
import { Box, Heading, Text, Grid, SimpleGrid, VStack, Spinner } from '@chakra-ui/react';
import StatCard from '../components/StatCard';
import ReviewCard from '../components/ReviewCard';
import { getStats } from '../services/stats';
import { FaUsers, FaImage, FaVolumeUp, FaEnvelope, FaFileAlt, FaBell } from 'react-icons/fa';
import { glassmorphismStyle } from '../theme';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        toast.error("Could not load platform stats.");
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const aboutText = "OmniOrchestrator is a cutting-edge AI-powered platform designed to streamline your marketing efforts. From crafting compelling emails to generating entire video scripts, our suite of tools helps you create high-quality content faster than ever before. Save time, boost engagement, and scale your brand with the power of artificial intelligence.";

  return (
    <VStack spacing={8} align="stretch" w="100%">
      <Box>
        <Heading size="lg" mb={4}>Platform Statistics</Heading>
        {loading ? (
            <Spinner color="cyan.400" />
        ) : (
            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={6}>
                <StatCard title="Total Users" value={stats?.users || 0} icon={FaUsers} />
                <StatCard title="Images Generated" value={stats?.images || 0} icon={FaImage} />
                <StatCard title="Audios Generated" value={stats?.audios || 0} icon={FaVolumeUp} />
                <StatCard title="Emails Generated" value={stats?.emails || 0} icon={FaEnvelope} />
                <StatCard title="Transcripts Generated" value={stats?.transcripts || 0} icon={FaFileAlt} />
                <StatCard title="Notifications Generated" value={stats?.notifications || 0} icon={FaBell} />
            </SimpleGrid>
        )}
      </Box>

      <Box p={6} {...glassmorphismStyle}>
        <Heading size="lg" mb={4}>About OmniOrchestrator</Heading>
        <Text color="gray.300">{aboutText}</Text>
      </Box>

      <Box>
        <Heading size="lg" mb={4}>What Our Customers Say</Heading>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
          <ReviewCard name="Sarah J." title="Marketing Director" comment="OmniOrchestrator has cut our content creation time in half. The quality is outstanding!" avatar="https://bit.ly/dan-abramov" />
          <ReviewCard name="Mike R." title="Social Media Manager" comment="The image and notification generators are game-changers for our daily workflow." avatar="https://bit.ly/kent-c-dodds" />
        </Grid>
      </Box>
    </VStack>
  );
};

export default Dashboard;