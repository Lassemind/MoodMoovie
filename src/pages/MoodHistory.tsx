import React from 'react'
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

// Mock data - replace with actual API call
const mockHistory = [
  {
    id: 1,
    mood: 'melancholisch',
    movie: 'Eternal Sunshine of the Spotless Mind',
    date: '2024-04-11',
    experience: 'Einen richtigen Filmabend',
  },
  {
    id: 2,
    mood: 'fröhlich',
    movie: 'The Grand Budapest Hotel',
    date: '2024-04-10',
    experience: 'Etwas Künstlerisches',
  },
]

const MoodHistory: React.FC = () => {
  const navigate = useNavigate()
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  return (
    <Container maxW="container.md" py={10}>
      <Box
        bg={bgColor}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={6} align="stretch">
          <Heading size="xl" textAlign="center">
            Deine Film-Historie
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Datum</Th>
                <Th>Stimmung</Th>
                <Th>Film</Th>
                <Th>Erlebnis</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockHistory.map((entry) => (
                <Tr key={entry.id}>
                  <Td>{entry.date}</Td>
                  <Td>
                    <Badge colorScheme="blue">{entry.mood}</Badge>
                  </Td>
                  <Td>{entry.movie}</Td>
                  <Td>{entry.experience}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Button
            colorScheme="blue"
            onClick={() => navigate('/')}
          >
            Neuen Film finden
          </Button>
        </VStack>
      </Box>
    </Container>
  )
}

export default MoodHistory 