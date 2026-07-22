import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import SongList from './components/SongList'
import SongDetail from './components/SongDetail'
import Dashboard from './components/Dashboard'
import SectionPage from './components/SectionPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/songs" element={<SongList />} />
        <Route path="/songs/:id" element={<SongDetail />} />
        <Route path="/songs/:id/section" element={<SectionPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App