import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  useColorModeValue,
  Spinner,
  Progress,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const MoodAnalysis: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const { mood, experienceId } = location.state as { mood: string; experienceId: string }

  useEffect(() => {
    // Simulate API call and analysis
    const timer = setTimeout(() => {
      navigate('/recommendation', { state: { mood, experienceId } })
    }, 3000)

    return () => clearTimeout(timer)
  }, [mood, experienceId, navigate])

  return (
    <Container maxW="container.md" py={10}>
      <MotionBox
        bg={bgColor}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        textAlign="center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6}>
          <Heading size="xl">Analysiere deine Stimmung...</Heading>
          <Text fontSize="lg" color="gray.600">
            Wir suchen den perfekten Film für dich
          </Text>
          <VStack spacing={4} width="full">
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Progress
              size="sm"
              width="full"
              isIndeterminate
              colorScheme="blue"
            />
          </VStack>
        </VStack>
      </MotionBox>
    </Container>
  )
}

export default MoodAnalysis 