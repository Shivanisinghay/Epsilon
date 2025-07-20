import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Heading, Text, VStack, Spinner, Card, CardBody, CardHeader, Divider, Button, Image, HStack,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalCloseButton, ModalBody, useDisclosure,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Icon
} from '@chakra-ui/react';
import { getContentHistory, deleteContent } from '../services/content';
import SocialShareButtons from '../components/SocialShareButtons';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getContentHistory();
      setHistory(data);
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

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteContent(itemToDelete._id);
      setHistory(prevHistory => prevHistory.filter(item => item._id !== itemToDelete._id));
      toast.success("Content deleted successfully!");
    } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to delete content.");
    } finally {
        onDeleteClose();
        setItemToDelete(null);
    }
  };
  
  // ... (handleCopy, handleViewImage, and renderContent functions remain the same)
  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const handleViewImage = (item) => {
    setSelectedItem(item);
    onViewOpen();
  };
  
  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = (item) => {
    const contentUrl = `${process.env.REACT_APP_BACKEND_URL}${item.generatedContent}`;
    switch (item.type) {
      case 'image':
        return (
          <Box>
            <Image src={contentUrl} alt={item.prompt} borderRadius="md" maxW="200px" cursor="pointer" onClick={() => handleViewImage(item)} />
            <HStack mt={4}>
                <Button size="sm" onClick={() => handleViewImage(item)} variant="outline" colorScheme="cyan">View</Button>
                <SocialShareButtons content={item.prompt} imageUrl={contentUrl} />
            </HStack>
          </Box>
        );
      case 'audio':
        return (
            <Box>
                <audio controls src={contentUrl} style={{ filter: 'invert(1)' }}> Your browser does not support the audio element. </audio>
                <HStack mt={4}>
                    <Button size="sm" onClick={() => handleDownload(contentUrl, `epsilon-audio.mp3`)} variant="outline" colorScheme="cyan">Download</Button>
                    <SocialShareButtons content={`Listen to this audio ad I generated: ${item.prompt}`} url={contentUrl} />
                </HStack>
            </Box>
        );
      default:
        return (
          <Box>
            <Text whiteSpace="pre-wrap">{item.generatedContent}</Text>
            <HStack mt={4}>
                <Button size="sm" onClick={() => handleCopy(item.generatedContent)} variant="outline" colorScheme="cyan">Copy Text</Button>
                <SocialShareButtons content={item.generatedContent} />
            </HStack>
          </Box>
        );
    }
  };


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
        <Heading as="h3" size="lg" mb={4}> Content Generation History </Heading>
        <VStack spacing={4} align="stretch" maxH="60vh" overflowY="auto" pr={4}>
          {history.length > 0 ? (
            history.map((item) => (
              <Card key={item._id}>
                <CardHeader>
                  <HStack justifyContent="space-between">
                    <Box>
                        <Heading size="md" textTransform="capitalize" color="white">{item.type}</Heading>
                        <Text fontSize="sm" color="gray.400">{new Date(item.createdAt).toLocaleString()}</Text>
                    </Box>
                    <Button size="sm" variant="ghost" colorScheme="red" onClick={() => openDeleteDialog(item)}>
                        <Icon as={FaTrash} />
                    </Button>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Text fontWeight="bold" color="cyan.400">Prompt:</Text>
                  <Text mb={4} noOfLines={2} color="gray.300">{item.prompt}</Text>
                  <Divider borderColor="whiteAlpha.300" />
                  <Text fontWeight="bold" mt={4} color="cyan.400">Generated Content:</Text>
                  {renderContent(item)}
                </CardBody>
              </Card>
            ))
          ) : (
            <Text>No history found. Start generating some content!</Text>
          )}
        </VStack>
      </Box>

      {/* Modal for Viewing Image */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader noOfLines={1}>{selectedItem?.prompt}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={`${process.env.REACT_APP_BACKEND_URL}${selectedItem?.generatedContent}`} alt={selectedItem?.prompt} maxW="100%" borderRadius="md" />
          </ModalBody>
           <ModalFooter>
             <Button onClick={onViewClose}> Close </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* AlertDialog for Deletion Confirmation */}
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