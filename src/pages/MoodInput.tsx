import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Textarea,
  HStack,
  useBreakpointValue,
  Flex,
  Icon,
  ScaleFade,
  FormControl,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaFilm, FaArrowRight, FaSmile, FaBolt, FaLaugh } from 'react-icons/fa'

const MotionBox = motion(Box)

interface MoodSliders {
  happiness: number;
  energy: number;
  humor: number;
  thoughtfulness: number;
  realism: number;
  comfort: number;
  social: number;
  clarity: number;
  attention: number;
}

const SLIDER_CONFIG = {
  happiness: {
    labels: ['Traurig', 'Glücklich'],
    gradient: ['catppuccin.blue', 'catppuccin.yellow'],
    icon: '😊'
  },
  energy: {
    labels: ['Entspannt', 'Energiegeladen'],
    gradient: ['catppuccin.green', 'catppuccin.peach'],
    icon: '⚡'
  },
  humor: {
    labels: ['Ernst', 'Humorvoll'],
    gradient: ['catppuccin.mauve', 'catppuccin.pink'],
    icon: '😄'
  },
  thoughtfulness: {
    labels: ['Locker', 'Tiefgründig'],
    gradient: ['catppuccin.sky', 'catppuccin.blue'],
    icon: '🤔'
  },
  realism: {
    labels: ['Realistisch', 'Fantastisch'],
    gradient: ['catppuccin.overlay0', 'catppuccin.lavender'],
    icon: '🌟'
  },
  comfort: {
    labels: ['Trostbedürftig', 'Emotional stabil'],
    gradient: ['catppuccin.red', 'catppuccin.green'],
    icon: '🫂'
  },
  social: {
    labels: ['Introvertiert', 'Beziehungsorientiert'],
    gradient: ['catppuccin.blue', 'catppuccin.pink'],
    icon: '👥'
  },
  clarity: {
    labels: ['Einfach abschalten', 'Mind-Bending'],
    gradient: ['catppuccin.teal', 'catppuccin.mauve'],
    icon: '🌀'
  },
  attention: {
    labels: ['Kurz & leicht', 'Intensiv & fordernd'],
    gradient: ['catppuccin.yellow', 'catppuccin.red'],
    icon: '📚'
  }
};

const INITIAL_MOOD: MoodSliders = {
  happiness: 50,
  energy: 50,
  humor: 50,
  thoughtfulness: 50,
  realism: 50,
  comfort: 50,
  social: 50,
  clarity: 50,
  attention: 50,
};

const SLIDER_GROUPS = {
  emotions: {
    title: 'Emotionale Stimmung',
    sliders: ['happiness', 'humor', 'energy'] as const
  },
  style: {
    title: 'Film-Stil',
    sliders: ['realism', 'thoughtfulness', 'clarity', 'attention'] as const
  },
  state: {
    title: 'Persönlicher Zustand',
    sliders: ['comfort', 'social'] as const
  }
};

const getBackgroundGradient = (sliders: MoodSliders) => {
  // Dominante Farben basierend auf den stärksten Ausschlägen
  const colors = [];
  
  // Fantasie vs. Realität (Violett vs. Grau)
  if (sliders.realism > 60) {
    colors.push('rgba(147, 112, 219, 0.15)'); // Violett
  } else if (sliders.realism < 40) {
    colors.push('rgba(128, 128, 128, 0.15)'); // Grau
  }
  
  // Glück vs. Trauer (Gelb vs. Blau)
  if (sliders.happiness > 60) {
    colors.push('rgba(255, 223, 0, 0.12)'); // Gelb
  } else if (sliders.happiness < 40) {
    colors.push('rgba(0, 102, 204, 0.12)'); // Blau
  }
  
  // Energie (Orange)
  if (sliders.energy > 60) {
    colors.push('rgba(255, 140, 0, 0.12)'); // Orange
  }
  
  // Fallback wenn keine starken Ausschläge
  if (colors.length === 0) {
    colors.push('rgba(128, 90, 213, 0.1)', 'rgba(237, 100, 166, 0.1)'); // Standard Violett/Pink
  }
  
  return `radial-gradient(circle at top left, ${colors.join(', ')}, transparent 80%)`;
};

const CustomSlider: React.FC<{
  name: keyof typeof SLIDER_CONFIG;
  value: number;
  onChange: (value: number) => void;
}> = ({ name, value, onChange }) => {
  const config = SLIDER_CONFIG[name];
  const bgGradient = `linear(to-r, ${config.gradient[0]}, ${config.gradient[1]})`;
  
  return (
    <FormControl mb={4}>
      <Box position="relative" mb={1}>
        {/* Labels */}
        <Flex justify="space-between" mb={1}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="catppuccin.subtext0"
          >
            {config.labels[0]}
          </Text>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="catppuccin.subtext0"
          >
            {config.labels[1]}
          </Text>
        </Flex>

        {/* Emoji */}
        <Box
          position="absolute"
          left="50%"
          top="-1"
          transform="translateX(-50%)"
          zIndex={1}
          bg="catppuccin.surface0"
          px={2}
          borderRadius="md"
          border="1px solid"
          borderColor="catppuccin.surface1"
        >
          <Text fontSize="lg" lineHeight="1">
            {config.icon}
          </Text>
        </Box>
      </Box>

      <Box
        position="relative"
        height="32px"
        display="flex"
        alignItems="center"
      >
        {/* Background Track */}
        <Box
          position="absolute"
          left={0}
          right={0}
          height="3px"
          bgGradient={bgGradient}
          borderRadius="full"
          opacity={0.15}
        />
        
        <Slider
          aria-label={name}
          value={value}
          onChange={onChange}
          focusThumbOnChange={false}
          step={1}
        >
          <SliderTrack
            bg="transparent"
            h="3px"
          >
            <SliderFilledTrack bgGradient={bgGradient} />
          </SliderTrack>
          
          <SliderThumb
            boxSize={4}
            bg="catppuccin.surface0"
            border="2px solid"
            borderColor={config.gradient[1]}
            _focus={{ 
              boxShadow: `0 0 0 3px ${config.gradient[1]}25`,
              borderColor: config.gradient[1],
            }}
            _hover={{ 
              boxShadow: `0 0 0 3px ${config.gradient[1]}25`,
              borderColor: config.gradient[1],
            }}
            _active={{
              boxShadow: `0 0 0 4px ${config.gradient[1]}40`,
              borderColor: config.gradient[1],
              cursor: "grabbing",
            }}
            cursor="grab"
            transition="all 0.2s"
            sx={{
              transform: 'translateY(-50%) !important',
              top: '50% !important',
            }}
          />
        </Slider>
      </Box>
    </FormControl>
  );
};

const generateMoodDescription = (sliders: MoodSliders): string => {
  const descriptions: string[] = [];
  
  // Hauptstimmung (basierend auf den stärksten Ausschlägen)
  if (sliders.realism < 40) {
    descriptions.push('etwas Realistisches');
  } else if (sliders.realism > 60) {
    descriptions.push('etwas Fantasievolles');
  }
  
  if (sliders.attention < 40) {
    descriptions.push('nicht zu Anstrengendes');
  } else if (sliders.attention > 60) {
    descriptions.push('geistig Forderndes');
  }

  // Emotionale Komponenten
  if (sliders.humor > 60) {
    descriptions.push('mit einer guten Portion Humor');
  } else if (sliders.humor < 40) {
    descriptions.push('mit ernsterem Unterton');
  }

  if (sliders.happiness < 40) {
    descriptions.push('das nachdenklich stimmt');
  } else if (sliders.happiness > 60) {
    descriptions.push('das aufheitert');
  }

  if (sliders.energy > 60) {
    descriptions.push('und viel Energie hat');
  } else if (sliders.energy < 40) {
    descriptions.push('zum Entspannen');
  }

  // Zusammensetzen der Beschreibung
  if (descriptions.length === 0) {
    return 'Bewege die Slider, um deine Filmvorlieben anzuzeigen';
  }

  let description = 'Du suchst ';
  if (descriptions.length === 1) {
    description += descriptions[0];
  } else {
    const lastPart = descriptions.pop();
    description += descriptions.join(', ') + ' ' + lastPart;
  }

  return description;
};

const MoodInput: React.FC = () => {
  const [moodText, setMoodText] = useState('')
  const [sliders, setSliders] = useState<MoodSliders>(INITIAL_MOOD)
  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })
  
  const bgColor = useColorModeValue('catppuccin.surface0', 'catppuccin.base')
  const textColor = useColorModeValue('catppuccin.text', 'catppuccin.text')
  const borderColor = useColorModeValue('catppuccin.surface1', 'catppuccin.surface1')
  const subTextColor = useColorModeValue('catppuccin.subtext0', 'catppuccin.subtext0')

  const handleSliderChange = (name: keyof MoodSliders, value: number) => {
    setSliders(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const combinedMood = {
      text: moodText.trim(),
      sliders,
    }
    navigate('/swipe', { state: { mood: combinedMood } })
  }

  const moodDescription = generateMoodDescription(sliders);
  const backgroundGradient = getBackgroundGradient(sliders);

  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      bg="catppuccin.base"
      _before={{
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: backgroundGradient,
        opacity: 1,
        transition: 'background 0.5s ease',
        zIndex: 0,
      }}
      sx={{
        '&::after': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(to bottom, rgba(24, 24, 37, 0.95), rgba(24, 24, 37, 0.85))`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
          pointerEvents: 'none',
        }
      }}
    >
      <Container 
        maxW="container.md" 
        py={isMobile ? 8 : 16}
        px={4}
        position="relative"
        zIndex={2}
      >
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Icon 
                as={FaFilm} 
                w={12} 
                h={12} 
                color="catppuccin.mauve"
              />
              <Heading
                size={isMobile ? "2xl" : "3xl"}
                bgGradient="linear(to-r, catppuccin.mauve, catppuccin.pink)"
                bgClip="text"
                letterSpacing="tight"
                lineHeight="1.2"
              >
                Finde deinen perfekten Film
              </Heading>
              <Text
                fontSize={isMobile ? "lg" : "xl"}
                color="catppuccin.subtext0"
                maxW="2xl"
              >
                Lass uns deine Stimmung erkunden und den idealen Film für dich finden
              </Text>
            </VStack>

            <Box
              w="100%"
              bg={bgColor}
              borderRadius="2xl"
              p={isMobile ? 6 : 8}
              border="1px solid"
              borderColor={borderColor}
              boxShadow="dark-lg"
              position="relative"
              backdropFilter="blur(8px)"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '2xl',
                background: 'linear-gradient(135deg, catppuccin.surface1 0%, transparent 100%)',
                opacity: 0.1,
                pointerEvents: 'none',
              }}
            >
              <form onSubmit={handleSubmit}>
                <VStack spacing={8}>
                  {Object.entries(SLIDER_GROUPS).map(([groupKey, group], groupIndex) => (
                    <Box key={groupKey} w="100%">
                      <Text
                        fontSize="md"
                        fontWeight="semibold"
                        mb={4}
                        color="catppuccin.subtext0"
                        borderBottom="2px solid"
                        borderColor="catppuccin.surface1"
                        pb={2}
                      >
                        {group.title}
                      </Text>
                      <VStack spacing={6} mb={groupIndex !== Object.keys(SLIDER_GROUPS).length - 1 ? 8 : 0}>
                        {group.sliders.map((key) => (
                          <CustomSlider
                            key={key}
                            name={key}
                            value={sliders[key]}
                            onChange={(value) => handleSliderChange(key, value)}
                          />
                        ))}
                      </VStack>
                    </Box>
                  ))}

                  <Box
                    w="100%"
                    p={4}
                    bg="catppuccin.surface0"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="catppuccin.surface1"
                  >
                    <Text
                      fontSize="md"
                      color="catppuccin.subtext0"
                      fontStyle="italic"
                    >
                      {moodDescription}
                    </Text>
                  </Box>

                  <VStack spacing={3} w="100%" pt={4}>
                    <Text
                      alignSelf="start"
                      fontSize="sm"
                      fontWeight="medium"
                      color="catppuccin.subtext0"
                    >
                      Beschreibe deine Stimmung (optional)
                    </Text>
                    <Textarea
                      value={moodText}
                      onChange={(e) => setMoodText(e.target.value)}
                      placeholder="z.B. Ich möchte etwas Romantisches mit einer Prise Humor..."
                      size="md"
                      resize="vertical"
                      maxLength={200}
                      bg="catppuccin.surface0"
                      borderColor="catppuccin.surface1"
                      color="catppuccin.text"
                      _placeholder={{ color: 'catppuccin.overlay0' }}
                      _hover={{
                        borderColor: 'catppuccin.mauve'
                      }}
                      _focus={{
                        borderColor: 'catppuccin.mauve',
                        boxShadow: '0 0 0 1px var(--chakra-colors-catppuccin-mauve)'
                      }}
                    />
                  </VStack>

                  <Button
                    type="submit"
                    size="lg"
                    width="full"
                    bg="catppuccin.mauve"
                    color="catppuccin.base"
                    _hover={{
                      bg: 'catppuccin.pink',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 0 20px var(--chakra-colors-catppuccin-mauve)',
                    }}
                    _active={{
                      bg: 'catppuccin.mauve',
                      transform: 'translateY(0)',
                    }}
                    transition="all 0.2s"
                  >
                    Filme entdecken
                  </Button>
                </VStack>
              </form>
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  )
}

export default MoodInput 