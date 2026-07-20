import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import SongList from './components/SongList'
import SongDetail from './components/SongDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/songs" element={<SongList />} />
        <Route path="/songs/:id" element={<SongDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App