import {
  HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, useDisclosure, Text, VStack, Link
} from '@chakra-ui/react';
import {
  FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton,
  FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon,
} from 'react-share';
import { FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SocialShareButtons = ({ content, url, imageUrl }) => {
  const shareUrl = url || window.location.href;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'epsilon-generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded! You can now share it on Instagram.");
  };

  return (
    <>
      <HStack mt={4} spacing={4}>
        <TwitterShareButton url={shareUrl} title={content}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <FacebookShareButton url={shareUrl} quote={content}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <LinkedinShareButton url={shareUrl} summary={content} title="Marketing Content">
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>

        <WhatsappShareButton url={shareUrl} title={content} separator=":: ">
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        {imageUrl && (
          <Button
            onClick={onOpen}
            p={0}
            borderRadius="full"
            width="32px"
            height="32px"
            bg="linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)"
            color="white"
            _hover={{ opacity: 0.9 }}
          >
            <FaInstagram size={16} />
          </Button>
        )}
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Share to Instagram</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} textAlign="center">
              <Text>Instagram doesn't allow direct sharing from websites. Please follow these steps:</Text>
              <Text>
                <strong>Step 1:</strong> Download the image to your device.
              </Text>
              <Button colorScheme="orange" onClick={handleDownload}>
                Download Image
              </Button>
              <Text>
                <strong>Step 2:</strong> Open your Instagram app (or{' '}
                <Link href="https://www.instagram.com" isExternal color="cyan.400">
                  instagram.com
                </Link>
                ) and upload the image.
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SocialShareButtons;