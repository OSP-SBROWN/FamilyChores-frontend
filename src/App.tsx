import React from 'react';
import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TimezoneManagement from './components/TimezoneManagement';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <div className="min-h-screen bg-gray-50">
          <Router>
            <Routes>
              <Route path="/" element={<TimezoneManagement />} />
              <Route path="/timezones" element={<TimezoneManagement />} />
            </Routes>
          </Router>
        </div>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}

export default App;

export default App;
