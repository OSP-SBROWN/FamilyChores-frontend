import { Routes, Route } from 'react-router-dom'
import Home from '../app/routes/home'
import Timezones from '../app/routes/timezones'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/timezones" element={<Timezones />} />
    </Routes>
  )
}

export default App
