import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Heading, Text, Spinner, Card, CardBody, CardHeader, Button, Image, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalCloseButton, ModalBody, useDisclosure,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
  SimpleGrid, Tag, IconButton, VStack, Spacer, Input, FormControl, FormLabel
} from '@chakra-ui/react';
import { getContentHistory, deleteContent } from '../services/content';
import SocialShareButtons from '../components/SocialShareButtons';
import toast from 'react-hot-toast';
import { FaTrash, FaCopy, FaDownload, FaEnvelope } from 'react-icons/fa';
import { glassmorphismStyle } from '../theme';

// Reusable modal for viewing content with actions
const ViewModal = ({ isOpen, onClose, selectedItem }) => {
  const [recipients, setRecipients] = useState('');

  // Effect to clear recipients when modal is closed or a new item is selected
  useEffect(() => {
    if (!isOpen) {
      setRecipients('');
    }
  }, [isOpen]);

  if (!selectedItem) return null;

  const contentUrl = `${process.env.REACT_APP_BACKEND_URL}${selectedItem.generatedContent}`;
  const contentType = selectedItem?.type || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedItem.generatedContent);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = contentUrl;
    const fileExtension = contentType === 'audio' ? 'mp3' : 'png';
    link.download = `epsilon-${contentType}-${selectedItem._id}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleShareEmail = () => {
    if (contentType !== 'email') return;

    if (!recipients.trim()) {
        toast.error('Please enter at least one recipient email address.');
        return;
    }

    const emailContent = selectedItem.generatedContent;
    let subject = '';
    let body = '';

    const subjectMatch = emailContent.match(/Subject: (.*)/);
    if (subjectMatch && subjectMatch[1]) {
      subject = subjectMatch[1];
      body = emailContent.substring(subjectMatch[0].length).trim();
    } else {
      const lines = emailContent.split('\n');
      subject = lines[0] || 'Email from Epsilon';
      body = lines.slice(1).join('\n').trim();
    }

    const mailtoLink = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    // FIX: Close the modal immediately after launching the email client
    onClose(); 
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white" {...glassmorphismStyle} bg="gray.900">
        <ModalHeader textTransform="capitalize">
          {contentType} Content
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={5}>
            <Box>
              <Heading size="sm" color="cyan.400">Prompt:</Heading>
              <Text mt={1}>{selectedItem.prompt}</Text>
            </Box>
            <Box w="100%">
              <Heading size="sm" color="cyan.400">Generated Content:</Heading>
              {contentType === 'image' ? (
                <Image src={contentUrl} alt={selectedItem.prompt} mt={2} maxW="100%" borderRadius="md" />
              ) : contentType === 'audio' ? (
                 <audio controls src={contentUrl} style={{ filter: 'invert(1)', width: '100%', marginTop: '8px' }}>
                    Your browser does not support the audio element.
                </audio>
              ) : (
                <Text mt={2} whiteSpace="pre-wrap" p={3} bg="blackAlpha.300" borderRadius="md">{selectedItem.generatedContent}</Text>
              )}
            </Box>

            {contentType === 'email' && (
                 <FormControl>
                    <FormLabel htmlFor="recipients" color="cyan.400">Recipients (comma-separated):</FormLabel>
                    <Input
                        id="recipients"
                        type="email"
                        placeholder="user1@example.com, user2@example.com"
                        value={recipients}
                        onChange={(e) => setRecipients(e.target.value)}
                        variant="filled"
                        bg="gray.700"
                        _hover={{ bg: 'gray.600' }}
                        _focus={{ bg: 'gray.600', borderColor: 'cyan.400' }}
                    />
                 </FormControl>
            )}

          </VStack>
        </ModalBody>
        <ModalFooter>
            {contentType === 'image' && <Button leftIcon={<FaDownload />} onClick={handleDownload} mr={3}>Download</Button>}
            {contentType === 'audio' && <Button leftIcon={<FaDownload />} onClick={handleDownload} mr={3}>Download</Button>}
            
            {contentType === 'email' ? (
                <Button leftIcon={<FaEnvelope />} onClick={handleShareEmail} colorScheme="cyan">Send Email</Button>
            ) : (
                 <SocialShareButtons
                    content={selectedItem.prompt}
                    url={contentType === 'audio' ? contentUrl : undefined}
                    imageUrl={contentType === 'image' ? contentUrl : undefined}
                />
            )}

            {contentType.match(/notification|transcript|email/) && <Button leftIcon={<FaCopy />} onClick={handleCopy} ml={3}>Copy Text</Button>}

            <Spacer />
            <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Larger, less congested History Item Card
const HistoryItem = ({ item, onView, onDelete }) => {
  return (
    <Card
      direction="column"
      variant="outline"
      minH="200px"
      onClick={() => onView(item)}
      cursor="pointer"
      _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-2px)' }}
      transition="all 0.2s ease-in-out"
      display="flex"
      flexDirection="column"
    >
      <CardHeader>
        <HStack justifyContent="space-between" alignItems="start">
          <Tag size="md" variant="solid" colorScheme='cyan' textTransform="capitalize">{item.type}</Tag>
          <IconButton
            aria-label="Delete content"
            icon={<FaTrash />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
            }}
          />
        </HStack>
      </CardHeader>
      <CardBody pt={0} display="flex" flexDirection="column" flex="1">
        <VStack align="start" spacing={3} h="100%" flex="1" justifyContent="space-between">
           <Text fontWeight="bold" noOfLines={5} title={item.prompt} flex="1">
             {item.prompt}
          </Text>
          <Text fontSize="xs" color="gray.500" alignSelf="flex-end">
            {new Date(item.createdAt).toLocaleTimeString()}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};


// Main History Component
const History = () => {
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef();
  
  const formatDateLabel = (dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return 'Today';
      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
      return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getContentHistory();
      const groupedHistory = data.reduce((acc, item) => {
          const date = new Date(item.createdAt).toDateString();
          if (!acc[date]) {
              acc[date] = [];
          }
          acc[date].push(item);
          return acc;
      }, {});
      setHistory(groupedHistory);
    } catch (error) {
      toast.error("Failed to fetch content history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const openDeleteDialog = (item) => {
    setItemToDelete(item);
    onDeleteOpen();
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    onViewOpen();
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteContent(itemToDelete._id);
      fetchHistory();
      toast.success("Content deleted successfully!");
    } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to delete content.");
    } finally {
        onDeleteClose();
        setItemToDelete(null);
    }
  };

  const sortedDates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" color="cyan.400" />
      </Box>
    );
  }

  return (
    <>
      <Box w="100%">
        <Heading as="h1" size="xl" mb={8} bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text">
          Content Generation History
        </Heading>
        {sortedDates.length > 0 ? (
          sortedDates.map(date => (
            <Box key={date} mb={8}>
                <Heading as="h2" size="lg" mb={4} borderBottom="2px" borderColor="cyan.400" pb={2}>
                    {formatDateLabel(date)}
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                    {history[date].map((item) => (
                      <HistoryItem
                        key={item._id}
                        item={item}
                        onView={openViewModal}
                        onDelete={openDeleteDialog}
                      />
                    ))}
                </SimpleGrid>
            </Box>
          ))
        ) : (
          <Box textAlign="center" p={10} {...glassmorphismStyle}>
            <Heading size="md">No History Found</Heading>
            <Text mt={2}>Start generating some content to see it here!</Text>
          </Box>
        )}
      </Box>

      <ViewModal
        isOpen={isViewOpen}
        onClose={onViewClose}
        selectedItem={selectedItem}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" color="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold"> Delete Content </AlertDialogHeader>
            <AlertDialogBody> Are you sure you want to delete this item? This action cannot be undone. </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose} variant="outline"> Cancel </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}> Delete </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default History;