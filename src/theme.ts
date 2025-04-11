import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// Catppuccin Mocha color palette
const colors = {
  catppuccin: {
    rosewater: '#f5e0dc',
    flamingo: '#f2cdcd',
    pink: '#f5c2e7',
    mauve: '#cba6f7',
    red: '#f38ba8',
    maroon: '#eba0ac',
    peach: '#fab387',
    yellow: '#f9e2af',
    green: '#a6e3a1',
    teal: '#94e2d5',
    sky: '#89dceb',
    sapphire: '#74c7ec',
    blue: '#89b4fa',
    lavender: '#b4befe',
    text: '#cdd6f4',
    subtext1: '#bac2de',
    subtext0: '#a6adc8',
    overlay2: '#9399b2',
    overlay1: '#7f849c',
    overlay0: '#6c7086',
    surface2: '#585b70',
    surface1: '#45475a',
    surface0: '#313244',
    base: '#1e1e2e',
    mantle: '#181825',
    crust: '#11111b',
  },
}

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors,
  styles: {
    global: {
      body: {
        bg: 'catppuccin.base',
        color: 'catppuccin.text',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        _hover: {
          transform: 'scale(1.05)',
        },
        transition: 'all 0.2s',
      },
      variants: {
        solid: {
          bg: 'catppuccin.mauve',
          color: 'catppuccin.base',
          _hover: {
            bg: 'catppuccin.pink',
          },
        },
        outline: {
          borderColor: 'catppuccin.mauve',
          color: 'catppuccin.mauve',
          _hover: {
            bg: 'catppuccin.surface0',
          },
        },
      },
    },
    IconButton: {
      variants: {
        solid: {
          bg: 'catppuccin.surface1',
          color: 'catppuccin.text',
          _hover: {
            bg: 'catppuccin.surface2',
            transform: 'scale(1.1)',
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        bg: 'catppuccin.surface0',
        color: 'catppuccin.text',
      },
      variants: {
        subtle: {
          bg: 'catppuccin.surface1',
          color: 'catppuccin.text',
        },
      },
    },
    Card: {
      baseStyle: {
        bg: 'catppuccin.surface0',
        color: 'catppuccin.text',
      },
    },
    Heading: {
      baseStyle: {
        color: 'catppuccin.text',
      },
    },
  },
})

export default theme 