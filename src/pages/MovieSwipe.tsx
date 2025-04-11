import React, { useState, useEffect, useRef } from 'react'
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
  IconButton,
  Flex,
} from '@chakra-ui/react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { FaHeart, FaTimes } from 'react-icons/fa'

// Mock data - replace with actual API call
const mockMovies = [
  {
    id: 1,
    title: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
    genres: ['Drama', 'Romance', 'Sci-Fi'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg',
    description: 'A man undergoes a procedure to erase memories of his failed relationship.',
  },
  {
    id: 2,
    title: 'The Grand Budapest Hotel',
    year: 2014,
    genres: ['Comedy', 'Drama', 'Adventure'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/nDP33LmQwNsnPvEdGtBg5oFC6jV.jpg',
    description: 'The adventures of Gustave H, a legendary concierge at a famous hotel, and Zero Moustafa, the lobby boy who becomes his most trusted friend.',
  },
  {
    id: 3,
    title: 'Inception',
    year: 2010,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
  },
]

const MotionBox = motion(Box)

const MovieSwipe: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const { mood } = location.state as { mood: string }
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [likedMovies, setLikedMovies] = useState<typeof mockMovies>([])
  const controls = useAnimation()
  const cardRef = useRef<HTMLDivElement>(null)

  const currentMovie = mockMovies[currentIndex]

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction)
    if (direction === 'right') {
      setLikedMovies([...likedMovies, currentMovie])
    }
    
    controls.start({
      x: direction === 'left' ? -1000 : 1000,
      rotate: direction === 'left' ? -30 : 30,
      transition: { duration: 0.5 }
    }).then(() => {
      setSwipeDirection(null)
      if (currentIndex < mockMovies.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        navigate('/results', { state: { mood, likedMovies } })
      }
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const startX = touch.clientX
    const startY = touch.clientY

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault()
        controls.start({
          x: deltaX,
          rotate: deltaX * 0.1,
          transition: { duration: 0 }
        })
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - startX
      
      if (Math.abs(deltaX) > 100) {
        handleSwipe(deltaX > 0 ? 'right' : 'left')
      } else {
        controls.start({
          x: 0,
          rotate: 0,
          transition: { duration: 0.3 }
        })
      }
      
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6}>
        <Heading size="xl" textAlign="center">
          Swipe durch Filme für deine Stimmung: {mood}
        </Heading>
        <Box
          position="relative"
          width="100%"
          height="600px"
          bg={bgColor}
          borderRadius="lg"
          overflow="hidden"
        >
          <AnimatePresence>
            <MotionBox
              ref={cardRef}
              key={currentMovie.id}
              position="absolute"
              width="100%"
              height="100%"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={controls}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5 }}
              onTouchStart={handleTouchStart}
              style={{ touchAction: 'none' }}
            >
              <Image
                src={currentMovie.posterUrl}
                alt={currentMovie.title}
                width="100%"
                height="100%"
                objectFit="cover"
              />
              <Box
                position="absolute"
                bottom="0"
                left="0"
                right="0"
                p={6}
                bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
              >
                <VStack align="start" spacing={2}>
                  <Heading size="lg" color="white">
                    {currentMovie.title}
                  </Heading>
                  <HStack>
                    <Text color="white">{currentMovie.year}</Text>
                    {currentMovie.genres.map((genre) => (
                      <Badge key={genre} colorScheme="blue">
                        {genre}
                      </Badge>
                    ))}
                  </HStack>
                  <Text color="white">{currentMovie.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          </AnimatePresence>
        </Box>
        <Flex gap={4}>
          <IconButton
            aria-label="Dislike"
            icon={<FaTimes />}
            size="lg"
            colorScheme="red"
            onClick={() => handleSwipe('left')}
          />
          <IconButton
            aria-label="Like"
            icon={<FaHeart />}
            size="lg"
            colorScheme="green"
            onClick={() => handleSwipe('right')}
          />
        </Flex>
      </VStack>
    </Container>
  )
}

export default MovieSwipe 