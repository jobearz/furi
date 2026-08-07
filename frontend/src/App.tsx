import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import { Register } from './components/Register'
import SongList from './components/SongList'
import SongDetail from './components/SongDetail'
import ProtectedPage from './components/ProtectedPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedPage />}>
          <Route path="/songs" element={<SongList />} />
          <Route path="/songs/:id" element={<SongDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App