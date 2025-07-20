import { HStack } from '@chakra-ui/react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';

const SocialShareButtons = ({ content }) => {
  const shareUrl = window.location.href;

  return (
    <HStack mt={4} spacing={4}>
      <FacebookShareButton url={shareUrl} quote={content}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={content}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton url={shareUrl} summary={content}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </HStack>
  );
};

export default SocialShareButtons;