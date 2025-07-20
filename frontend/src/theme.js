import { extendTheme } from '@chakra-ui/react';

const glassmorphismStyle = {
  bg: 'rgba(23, 25, 35, 0.5)',
  backdropFilter: 'blur(10px)',
  borderColor: 'whiteAlpha.200',
  borderWidth: '1px',
  borderRadius: 'xl',
  boxShadow: 'lg',
};

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: '#0A0A19',
        color: 'gray.300',
        backgroundImage: `radial-gradient(circle at 10% 20%, rgba(100, 100, 255, 0.15), transparent 40%), 
                         radial-gradient(circle at 90% 80%, rgba(255, 100, 200, 0.15), transparent 40%)`,
        backgroundAttachment: 'fixed',
      },
    },
  },
  colors: {
    purple: { 500: '#8860D0' },
    blue: { 500: '#5680E9' },
    cyan: { 400: '#5AB9EA' },
  },
  components: {
    Button: {
      variants: {
        solid: {
          bgGradient: 'linear(to-r, purple.500, blue.500)',
          color: 'white',
          _hover: { bgGradient: 'linear(to-r, purple.600, blue.600)', transform: 'translateY(-2px)', boxShadow: 'lg' },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'rgba(0, 0, 0, 0.3)',
            borderColor: 'whiteAlpha.300',
            _hover: { borderColor: 'whiteAlpha.400' },
            _focus: { borderColor: 'cyan.400', boxShadow: `0 0 0 1px var(--chakra-colors-cyan-400)` },
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          bg: 'rgba(0, 0, 0, 0.3)',
          borderColor: 'whiteAlpha.300',
          _hover: { borderColor: 'whiteAlpha.400' },
          _focus: { borderColor: 'cyan.400', boxShadow: `0 0 0 1px var(--chakra-colors-cyan-400)` },
        },
      },
    },
    Tabs: {
      variants: {
        'soft-rounded': {
          tab: {
            bg: 'whiteAlpha.100',
            color: 'whiteAlpha.700',
            _selected: { color: 'white', bg: 'whiteAlpha.200' },
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: { ...glassmorphismStyle, bg: 'whiteAlpha.100', borderColor: 'whiteAlpha.300' }
      },
      parts: ['header', 'body', 'footer'],
      baseStyle: {
        header: { color: 'white' },
        body: { color: 'gray.300' }
      }
    },
    FormLabel: {
      baseStyle: { color: 'cyan.400', fontWeight: 'bold' }
    },
    Heading: {
      baseStyle: { color: 'whiteAlpha.900' }
    },
    Text: {
      baseStyle: { color: 'gray.300' }
    }
  },
});

export { glassmorphismStyle };
export default theme;