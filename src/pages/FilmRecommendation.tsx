import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  Image,
  HStack,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

// Mock data - replace with actual API call
const mockMovie = {
  title: 'Eternal Sunshine of the Spotless Mind',
  year: 2004,
  genres: ['Drama', 'Romance', 'Sci-Fi'],
  posterUrl: 'https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg',
  description: 'A man undergoes a procedure to erase memories of his failed relationship.',
  explanation: 'Dieser Film passt perfekt zu deiner melancholischen Stimmung, da er die Komplexität von Beziehungen und Erinnerungen auf eine poetische Weise erkundet.',
}

const FilmRecommendation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const { mood, experienceId } = location.state as { mood: string; experienceId: string }

  return (
    <Container maxW="container.md" py={10}>
      <MotionBox
        bg={bgColor}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6} align="stretch">
          <Heading size="xl" textAlign="center">
            Dein Film für heute
          </Heading>
          <Box position="relative" borderRadius="lg" overflow="hidden">
            <Image
              src={mockMovie.posterUrl}
              alt={mockMovie.title}
              width="100%"
              objectFit="cover"
            />
          </Box>
          <VStack spacing={4} align="stretch">
            <Heading size="lg">{mockMovie.title}</Heading>
            <HStack>
              <Text color="gray.500">{mockMovie.year}</Text>
              {mockMovie.genres.map((genre) => (
                <Badge key={genre} colorScheme="blue">
                  {genre}
                </Badge>
              ))}
            </HStack>
            <Text>{mockMovie.description}</Text>
            <Box bg="blue.50" p={4} borderRadius="md">
              <Text color="blue.800">{mockMovie.explanation}</Text>
            </Box>
          </VStack>
          <HStack spacing={4} justify="center">
            <Button
              colorScheme="blue"
              onClick={() => window.open('https://www.youtube.com/watch?v=dummy', '_blank')}
            >
              Trailer ansehen
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/history')}
            >
              Zur Historie
            </Button>
          </HStack>
        </VStack>
      </MotionBox>
    </Container>
  )
}

export default FilmRecommendation 