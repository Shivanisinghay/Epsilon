import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from 'react-share';
import { HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaShareAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SocialShareButtons = ({ content, url, imageUrl }) => {
  // Use the image URL if available, otherwise fall back to the provided URL or the page URL.
  const shareUrl = imageUrl || url || window.location.href;
  const title = content;

  // This function uses the modern Web Share API to share the actual file.
  const handleNativeShare = async () => {
    if (!imageUrl) {
      toast.error("No image file available to share.");
      return;
    }

    try {
      // 1. Fetch the image data from your backend
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Image could not be fetched.');
      }
      const blob = await response.blob();
      
      // 2. Create a file object that the share API can use
      const file = new File([blob], 'epsilon-image.png', { type: blob.type });

      // 3. Check if the browser can share this file type
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        // 4. Open the native share dialog
        await navigator.share({
          files: [file],
          title: title,
          text: `Image generated with Epsilon: ${title}`,
        });
      } else {
        toast.error("Your browser doesn't support sharing files directly.");
      }
    } catch (err) {
      console.error("Share failed:", err);
      toast.error("Could not share the image.");
    }
  };
  
  // Check if the browser supports the Web Share API for files.
  const isWebShareSupported = typeof navigator.share === 'function' && typeof navigator.canShare === 'function';

  return (
    <HStack spacing={2}>
      {/* 1. Primary "Share" Button for modern devices */}
      {isWebShareSupported && imageUrl && (
        <Tooltip label="Share Image File" placement="top" hasArrow>
          <IconButton
            icon={<FaShareAlt />}
            isRound
            size="sm"
            colorScheme="messenger"
            aria-label="Share Image File"
            onClick={handleNativeShare}
          />
        </Tooltip>
      )}

      {/* 2. Fallback buttons for other platforms/browsers */}
      <Tooltip label="Share on Facebook" placement="top" hasArrow>
        <FacebookShareButton url={shareUrl} quote={title}>
          <IconButton
            icon={<FaFacebook />}
            isRound
            size="sm"
            colorScheme="facebook"
            aria-label="Share on Facebook"
          />
        </FacebookShareButton>
      </Tooltip>

      <Tooltip label="Share on Twitter" placement="top" hasArrow>
        <TwitterShareButton url={shareUrl} title={title}>
          <IconButton
            icon={<FaTwitter />}
            isRound
            size="sm"
            colorScheme="twitter"
            aria-label="Share on Twitter"
          />
        </TwitterShareButton>
      </Tooltip>
      
      <Tooltip label="Share on LinkedIn" placement="top" hasArrow>
        <LinkedinShareButton url={shareUrl} title={title} summary={content.substring(0, 100)}>
          <IconButton
            icon={<FaLinkedin />}
            isRound
            size="sm"
            colorScheme="linkedin"
            aria-label="Share on LinkedIn"
          />
        </LinkedinShareButton>
      </Tooltip>

      <Tooltip label="Share on WhatsApp" placement="top" hasArrow>
      <WhatsappShareButton url={shareUrl} title={title}>
        <IconButton
          icon={<FaWhatsapp />}
          isRound
          size="sm"
          colorScheme="whatsapp"
          aria-label="Share on WhatsApp"
        />
      </WhatsappShareButton>
      </Tooltip>
    </HStack>
  );
};

export default SocialShareButtons;