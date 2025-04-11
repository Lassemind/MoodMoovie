import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Image,
  HStack,
  Badge,
  IconButton,
  Flex,
  Spinner,
  Center,
  useToast,
  Button,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { FaHeart, FaTimes, FaUndo } from 'react-icons/fa'
import { getMoviesByMood, getGenres } from '../services/tmdb'

const MotionBox = motion(Box)

interface Movie {
  id: number;
  title: string;
  year: number | null;
  posterUrl: string;
  description: string;
  genres: number[];
  explanation: string;
  rating: number;
}

interface Genre {
  id: number;
  name: string;
}

interface MoodInput {
  text: string;
  sliders: {
    happiness: number;
    energy: number;
    humor: number;
  };
}

const MovieCard: React.FC<{
  movie: Movie;
  genres: Genre[];
  onSwipe: (direction: 'left' | 'right') => void;
}> = ({ movie, genres, onSwipe }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    const offset = info.offset.x;
    
    if (Math.abs(offset) > threshold) {
      onSwipe(offset > 0 ? 'right' : 'left');
    }
  };

  const movieGenres = movie.genres
    .map(id => genres.find(g => g.id === id)?.name)
    .filter(Boolean);

  const posterUrl = movie.posterUrl.startsWith('http') 
    ? movie.posterUrl 
    : `https://image.tmdb.org/t/p/w500${movie.posterUrl}`;

  return (
    <MotionBox
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{
        width: '100%',
        maxWidth: '350px',
        aspectRatio: '2/3',
        perspective: '1000px',
      }}
    >
      <MotionBox
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front of card (poster) */}
        <Box
          position="absolute"
          width="100%"
          height="100%"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="xl"
          bg={bgColor}
        >
          {!imageLoaded && !imageError && (
            <Center height="100%" bg={bgColor}>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="purple.500"
                size="xl"
              />
            </Center>
          )}
          
          {!imageError ? (
            <Image
              src={posterUrl}
              alt={movie.title}
              width="100%"
              height="100%"
              objectFit="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
          ) : (
            <VStack spacing={4} justify="center" height="100%" p={6}>
              <Text fontSize="xl" color={textColor} textAlign="center">
                Kein Filmposter verfügbar
              </Text>
              <Text color={textColor} fontSize="lg" textAlign="center">
                {movie.title}
              </Text>
            </VStack>
          )}
        </Box>

        {/* Back of card (details) */}
        <Box
          position="absolute"
          width="100%"
          height="100%"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="xl"
          bg={bgColor}
          p={6}
        >
          <VStack spacing={4} align="start" height="100%">
            <Heading size="lg" color={textColor}>
              {movie.title} {movie.year && `(${movie.year})`}
            </Heading>
            
            <HStack spacing={2} wrap="wrap">
              {movieGenres.map((genre, index) => (
                <Badge key={index} colorScheme="purple" fontSize="sm">
                  {genre}
                </Badge>
              ))}
            </HStack>

            <Text fontSize="sm" color="purple.500" fontWeight="bold">
              Bewertung: {movie.rating.toFixed(1)}/10
            </Text>

            <Text fontSize="md" color={textColor} noOfLines={6}>
              {movie.description}
            </Text>

            <Box mt="auto">
              <Text fontSize="sm" color="purple.500" fontStyle="italic">
                {movie.explanation}
              </Text>
            </Box>
          </VStack>
        </Box>
      </MotionBox>
    </MotionBox>
  );
};

const MovieSwipe: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()
  const isMobile = useBreakpointValue({ base: true, md: false })
  
  if (!location.state?.mood) {
    navigate('/')
    return null
  }
  
  const { mood } = location.state as { mood: MoodInput }
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [likedMovies, setLikedMovies] = useState<Movie[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const controls = useAnimation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Lade zuerst die Genres
        const genresData = await getGenres()
        if (!genresData || genresData.length === 0) {
          console.error('No genres returned from API')
          setError('Fehler beim Laden der Genres')
          return
        }
        setGenres(genresData)
        
        // Lade dann die Filme basierend auf der Stimmung
        console.log('Fetching movies for mood:', mood)
        const moviesData = await getMoviesByMood(mood)
        
        if (!moviesData || moviesData.length === 0) {
          console.error('No movies returned from API')
          setError('Keine Filme gefunden')
          return
        }

        console.log(`Received ${moviesData.length} movies from API`)
        setMovies(moviesData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error in MovieSwipe:', error)
        setError(error instanceof Error ? error.message : 'Fehler beim Laden der Filme')
        toast({
          title: 'Fehler',
          description: error instanceof Error ? error.message : 'Es gab ein Problem beim Laden der Filme.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        })
      }
    }

    fetchData()
  }, [mood, toast])

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= movies.length) return
    
    setSwipeDirection(direction)
    if (direction === 'right') {
      setLikedMovies(prev => [...prev, movies[currentIndex]])
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setSwipeDirection(null)
    }, 300)
  }

  if (isLoading) {
    return (
      <Container maxW="container.lg" py={isMobile ? 6 : 10}>
        <Center h="80vh" flexDirection="column" gap={4}>
          <Spinner 
            size="xl" 
            thickness="4px" 
            speed="0.65s" 
            color="catppuccin.mauve"
            emptyColor="catppuccin.surface0"
          />
          <Text fontSize={isMobile ? "md" : "lg"} color="catppuccin.text">
            Filme werden geladen...
          </Text>
        </Center>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={isMobile ? 6 : 10}>
        <Center h="80vh" flexDirection="column" gap={6}>
          <Text color="catppuccin.red" fontSize={isMobile ? "lg" : "xl"}>
            {error}
          </Text>
          <Button
            leftIcon={<FaUndo />}
            size={isMobile ? "md" : "lg"}
            onClick={() => navigate('/')}
            variant="solid"
            bg="catppuccin.mauve"
            color="catppuccin.base"
            _hover={{
              bg: 'catppuccin.pink',
              transform: 'scale(1.05)',
            }}
          >
            Zurück zur Startseite
          </Button>
        </Center>
      </Container>
    )
  }

  if (currentIndex >= movies.length) {
    return (
      <Container maxW="container.lg" py={isMobile ? 6 : 10}>
        <Center h="80vh" flexDirection="column" gap={6}>
          <Heading size="lg">Deine Filmauswahl</Heading>
          {likedMovies.length > 0 ? (
            <VStack spacing={4} align="stretch" width="100%">
              {likedMovies.map(movie => (
                <Box 
                  key={movie.id}
                  p={4}
                  borderRadius="lg"
                  boxShadow="md"
                  bg={useColorModeValue('white', 'gray.800')}
                >
                  <HStack spacing={4}>
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      boxSize="100px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <VStack align="start" spacing={2}>
                      <Heading size="md">{movie.title}</Heading>
                      <Text fontSize="sm">{movie.explanation}</Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text>Du hast keine Filme ausgewählt</Text>
          )}
          <Text 
            color="catppuccin.mauve" 
            cursor="pointer" 
            onClick={() => navigate('/')}
          >
            Neue Suche starten
          </Text>
        </Center>
      </Container>
    )
  }

  return (
    <Container maxW="container.lg" py={isMobile ? 6 : 10}>
      <VStack spacing={isMobile ? 6 : 8} height="100vh" justify="start">
        <Box 
          position="relative" 
          width="100%" 
          textAlign="center"
          mb={4}
        >
          <Heading
            size={isMobile ? "lg" : "xl"}
            bgGradient="linear(to-r, purple.400, pink.400)"
            bgClip="text"
            letterSpacing="tight"
            mb={2}
          >
            Swipe durch Filme
          </Heading>
          <Text
            fontSize={isMobile ? "md" : "lg"}
            color="purple.300"
            fontWeight="medium"
          >
            für deine Stimmung: {mood.text}
          </Text>
        </Box>

        <Box
          position="relative"
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flex="1"
        >
          <Box
            position="relative"
            width="100%"
            maxW="380px"
            aspectRatio="2/3"
            bg="whiteAlpha.50"
            borderRadius="3xl"
            overflow="hidden"
            boxShadow="2xl"
            p={3}
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '24px',
              padding: '2px',
              background: 'linear-gradient(45deg, purple.400, pink.400)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          >
            <AnimatePresence>
              <MovieCard
                key={movies[currentIndex].id}
                movie={movies[currentIndex]}
                genres={genres}
                onSwipe={handleSwipe}
              />
            </AnimatePresence>
          </Box>

          <Flex 
            gap={8} 
            mt={6}
            position="relative"
            zIndex={1}
          >
            <IconButton
              aria-label="Dislike"
              icon={<FaTimes size={24} />}
              size="lg"
              onClick={() => handleSwipe('left')}
              isRound
              bg="red.400"
              color="white"
              _hover={{
                bg: 'red.500',
                transform: 'scale(1.1)',
              }}
              _active={{
                bg: 'red.600',
                transform: 'scale(0.95)',
              }}
              transition="all 0.2s"
              boxShadow="lg"
            />
            <IconButton
              aria-label="Like"
              icon={<FaHeart size={24} />}
              size="lg"
              onClick={() => handleSwipe('right')}
              isRound
              bg="green.400"
              color="white"
              _hover={{
                bg: 'green.500',
                transform: 'scale(1.1)',
              }}
              _active={{
                bg: 'green.600',
                transform: 'scale(0.95)',
              }}
              transition="all 0.2s"
              boxShadow="lg"
            />
          </Flex>
        </Box>

        <Text
          fontSize="sm"
          color="gray.500"
          textAlign="center"
          position="absolute"
          bottom={4}
          left={0}
          right={0}
        >
          Tippe auf die Karte für Details
        </Text>
      </VStack>
    </Container>
  )
}

export default MovieSwipe 