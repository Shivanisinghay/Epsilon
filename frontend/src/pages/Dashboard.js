import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import EmailGenerator from '../components/EmailGenerator';
import NotificationGenerator from '../components/NotificationGenerator';
import TranscriptGenerator from '../components/TranscriptGenerator';
import ImageGenerator from '../components/ImageGenerator';
import AudioGenerator from '../components/AudioGenerator';
import History from './History'; // New

const Dashboard = () => {
  return (
    <Box p={{ base: 4, md: 8 }}>
      <Heading as="h1" mb={8}>
        Marketing Content Generation
      </Heading>
      <Tabs isLazy variant="soft-rounded" colorScheme="teal">
        <TabList overflowX="auto" pb={2}>
          <Tab>Email</Tab>
          <Tab>Notification</Tab>
          <Tab>Video Transcript</Tab>
          <Tab>Image Ad</Tab>
          <Tab>Audio Ad</Tab>
          <Tab>History</Tab> {/* New */}
        </TabList>
        <TabPanels mt={4}>
          <TabPanel>
            <EmailGenerator />
          </TabPanel>
          <TabPanel>
            <NotificationGenerator />
          </TabPanel>
          <TabPanel>
            <TranscriptGenerator />
          </TabPanel>
          <TabPanel>
            <ImageGenerator />
          </TabPanel>
          <TabPanel>
            <AudioGenerator />
          </TabPanel>
          <TabPanel>
            <History /> {/* New */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Dashboard;