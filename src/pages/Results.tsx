import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Image,
  HStack,
  useColorModeValue,
  Badge,
  Button,
  SimpleGrid,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const Results: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const { mood, likedMovies } = location.state as { mood: string; likedMovies: any[] }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6}>
        <Heading size="xl" textAlign="center">
          Deine Filmauswahl für {mood}
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="100%">
          {likedMovies.map((movie) => (
            <MotionBox
              key={movie.id}
              bg={bgColor}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                width="100%"
                height="300px"
                objectFit="cover"
              />
              <Box p={6}>
                <VStack align="start" spacing={4}>
                  <Heading size="md">{movie.title}</Heading>
                  <HStack>
                    <Text color="gray.500">{movie.year}</Text>
                    {movie.genres.map((genre: string) => (
                      <Badge key={genre} colorScheme="blue">
                        {genre}
                      </Badge>
                    ))}
                  </HStack>
                  <Text>{movie.description}</Text>
                  <Button
                    colorScheme="blue"
                    width="full"
                    onClick={() => window.open(`https://www.youtube.com/results?search_query=${movie.title}+trailer`, '_blank')}
                  >
                    Trailer ansehen
                  </Button>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => navigate('/')}
        >
          Neue Suche starten
        </Button>
      </VStack>
    </Container>
  )
}

export default Results 