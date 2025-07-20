import { useEffect, useState } from 'react';
import { Box, Heading, Text, Grid, SimpleGrid, VStack, Spinner } from '@chakra-ui/react';
import StatCard from '../components/StatCard';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm'; // Import the new form
import { getStats } from '../services/stats';
import { getReviews } from '../services/reviews'; // Import the new service
import { FaUsers, FaImage, FaVolumeUp, FaEnvelope, FaFileAlt, FaBell } from 'react-icons/fa';
import { glassmorphismStyle } from '../theme';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      toast.error("Could not load platform stats.");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (error) {
      toast.error("Could not load customer reviews.");
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchReviews();
  }, []);

  const handleReviewSubmitted = () => {
    // Re-fetch reviews to show the new one
    fetchReviews();
  };
  
  const aboutText = "OmniOrchestrator is a cutting-edge AI-powered platform designed to streamline your marketing efforts. From crafting compelling emails to generating entire video scripts, our suite of tools helps you create high-quality content faster than ever before. Save time, boost engagement, and scale your brand with the power of artificial intelligence.";


  return (
    <VStack spacing={8} align="stretch" w="100%">
      {/* Platform Statistics Section */}
      <Box>
        <Heading size="lg" mb={4}>Platform Statistics</Heading>
        {loadingStats ? (
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

      {/* About Section */}
      <Box p={6} {...glassmorphismStyle}>
        <Heading size="lg" mb={4}>About OmniOrchestrator</Heading>
        <Text color="gray.300">{aboutText}</Text>
      </Box>

      {/* Customer Reviews Section */}
      <Box>
        <Heading size="lg" mb={4}>What Our Customers Say</Heading>
        {loadingReviews ? (
          <Spinner color="cyan.400" />
        ) : reviews.length > 0 ? (
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
            {reviews.map(review => (
              <ReviewCard
                key={review._id}
                name={review.user.name}
                title={`Rated ${review.rating} Stars`}
                comment={review.comment}
                avatar={review.user.avatar} // Assuming user object has an avatar
              />
            ))}
          </Grid>
        ) : (
          <Text color="gray.400">No reviews yet. Be the first to share your thoughts below!</Text>
        )}
      </Box>

      {/* Review Submission Form */}
      <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
    </VStack>
  );
};

export default Dashboard;