import React from 'react'
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MoodInput from './pages/MoodInput'
import MovieSwipe from './pages/MovieSwipe'
import Results from './pages/Results'
import theme from './theme'

const queryClient = new QueryClient()
const { ToastContainer } = createStandaloneToast()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<MoodInput />} />
            <Route path="/swipe" element={<MovieSwipe />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </Router>
        <ToastContainer />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App 