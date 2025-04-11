import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

const experienceOptions = [
  {
    id: 'light',
    title: 'Nur was Leichtes nebenbei',
    description: 'Etwas zum Entspannen und nebenbei schauen',
  },
  {
    id: 'movie-night',
    title: 'Einen richtigen Filmabend',
    description: 'Ein Film, der dich fesselt und mitnimmt',
  },
  {
    id: 'artistic',
    title: 'Etwas Künstlerisches',
    description: 'Ein Film mit besonderer Ästhetik und Tiefe',
  },
  {
    id: 'surprise',
    title: 'Überrasch mich',
    description: 'Lass dich von etwas Unerwartetem überraschen',
  },
]

const ExperienceType: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const { mood } = location.state as { mood: string }

  const handleSelect = (experienceId: string) => {
    navigate('/analysis', { state: { mood, experienceId } })
  }

  return (
    <Container maxW="container.md" py={10}>
      <Box
        bg={bgColor}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Heading size="xl">Wie viel willst du dich auf den Film einlassen?</Heading>
          <Text fontSize="lg" color="gray.600">
            Wähle dein gewünschtes Filmerlebnis
          </Text>
          <VStack spacing={4} width="full">
            {experienceOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                size="lg"
                width="full"
                height="auto"
                py={4}
                onClick={() => handleSelect(option.id)}
              >
                <VStack spacing={1}>
                  <Text fontSize="lg" fontWeight="bold">
                    {option.title}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {option.description}
                  </Text>
                </VStack>
              </Button>
            ))}
          </VStack>
        </VStack>
      </Box>
    </Container>
  )
}

export default ExperienceType 