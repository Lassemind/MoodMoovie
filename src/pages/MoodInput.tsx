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
  useColorModeValue,
} from '@chakra-ui/react'

const MoodInput: React.FC = () => {
  const [mood, setMood] = useState('')
  const navigate = useNavigate()
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mood.trim()) {
      navigate('/swipe', { state: { mood } })
    }
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
          <Heading size="xl">Wie fühlst du dich gerade?</Heading>
          <Text fontSize="lg" color="gray.600">
            Beschreibe deine Stimmung in ein paar Worten
          </Text>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <Input
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="z.B. 'Ich bin melancholisch'"
                size="lg"
                required
              />
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                isDisabled={!mood.trim()}
              >
                Filme entdecken
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  )
}

export default MoodInput 