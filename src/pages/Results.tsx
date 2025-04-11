import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Image,
  VStack,
  Button,
  Badge,
  useBreakpointValue,
  Card,
  CardBody,
  Stack,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaUndo } from 'react-icons/fa'

const MotionBox = motion(Box)

const Results: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (!location.state?.likedMovies || !location.state?.mood) {
    navigate('/')
    return null
  }

  const { likedMovies, mood } = location.state

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <Container maxW="container.xl" py={isMobile ? 6 : 10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading
            size={isMobile ? "lg" : "xl"}
            mb={4}
            bgGradient="linear(to-r, catppuccin.mauve, catppuccin.pink)"
            bgClip="text"
            letterSpacing="tight"
          >
            Deine Film-Matches für: {mood}
          </Heading>
          <Text 
            fontSize={isMobile ? "md" : "lg"}
            color="catppuccin.subtext1"
            mb={8}
          >
            {likedMovies.length === 0
              ? 'Du hast noch keine Filme geliked.'
              : `Du hast ${likedMovies.length} Film${likedMovies.length === 1 ? '' : 'e'} geliked!`}
          </Text>
        </Box>

        {likedMovies.length > 0 ? (
          <MotionBox
            variants={container}
            initial="hidden"
            animate="show"
          >
            <SimpleGrid 
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
              spacing={6}
            >
              {likedMovies.map((movie: any) => (
                <MotionBox
                  key={movie.id}
                  variants={item}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    overflow="hidden"
                    variant="filled"
                    bg="catppuccin.surface0"
                    borderRadius="xl"
                    boxShadow="dark-lg"
                    height="100%"
                    _hover={{
                      bg: 'catppuccin.surface1',
                    }}
                  >
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      height="300px"
                      objectFit="cover"
                    />
                    <CardBody>
                      <Stack spacing={4}>
                        <Heading 
                          size={isMobile ? "md" : "lg"}
                          color="catppuccin.text"
                        >
                          {movie.title}
                          <Text 
                            as="span" 
                            fontSize={isMobile ? "sm" : "md"}
                            color="catppuccin.subtext0"
                            ml={2}
                          >
                            ({movie.year})
                          </Text>
                        </Heading>
                        <Box>
                          {movie.genres.map((genre: string) => (
                            <Badge
                              key={genre}
                              mr={2}
                              mb={2}
                              px={2}
                              py={1}
                              borderRadius="full"
                              bg="catppuccin.surface1"
                              color="catppuccin.text"
                              fontSize="sm"
                            >
                              {genre}
                            </Badge>
                          ))}
                        </Box>
                        <Text 
                          color="catppuccin.subtext1"
                          fontSize={isMobile ? "sm" : "md"}
                          noOfLines={3}
                        >
                          {movie.description}
                        </Text>
                      </Stack>
                    </CardBody>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
        ) : null}

        <Box textAlign="center" mt={8}>
          <Button
            leftIcon={<FaUndo />}
            onClick={() => navigate('/')}
            size={isMobile ? "md" : "lg"}
            variant="solid"
            bg="catppuccin.mauve"
            color="catppuccin.base"
            _hover={{
              bg: 'catppuccin.pink',
              transform: 'scale(1.05)',
            }}
          >
            Neue Suche starten
          </Button>
        </Box>
      </VStack>
    </Container>
  )
}

export default Results 