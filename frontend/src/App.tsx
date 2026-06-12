import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import SongList from './components/SongList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SongList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/songs/:id" element={<h1>Song Detail</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App