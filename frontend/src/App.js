import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Grid, GridItem, useBreakpointValue, Box } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import History from './pages/History';
// Corrected import paths below
import EmailGeneratorPage from './pages/generators/EmailGeneratorPage';
import NotificationGeneratorPage from './pages/generators/NotificationGeneratorPage';
import TranscriptGeneratorPage from './pages/generators/TranscriptGeneratorPage';
import ImageGeneratorPage from './pages/generators/ImageGeneratorPage';
import AudioGeneratorPage from './pages/generators/AudioGeneratorPage';


function App() {
  const { user } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const MainContent = () => (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
      <Route path="/generate/email" element={user ? <EmailGeneratorPage /> : <Navigate to="/login" />} />
      <Route path="/generate/notification" element={user ? <NotificationGeneratorPage /> : <Navigate to="/login" />} />
      <Route path="/generate/transcript" element={user ? <TranscriptGeneratorPage /> : <Navigate to="/login" />} />
      <Route path="/generate/image" element={user ? <ImageGeneratorPage /> : <Navigate to="/login" />} />
      <Route path="/generate/audio" element={user ? <AudioGeneratorPage /> : <Navigate to="/login" />} />
    </Routes>
  );

  return (
    <Router>
      {user && !isMobile ? (
        <Grid templateColumns="250px 1fr" h="100vh">
          <GridItem as="aside">
            <Sidebar />
          </GridItem>
          <GridItem as="main" overflowY="auto" p={{ base: 4, md: 8 }}>
            <MainContent />
          </GridItem>
        </Grid>
      ) : (
        <>
            {user && isMobile && <Sidebar />}
            <Box pt={isMobile && user ? "60px" : "0"} p={4}>
                <MainContent />
            </Box>
        </>
      )}
    </Router>
  );
}

export default App;