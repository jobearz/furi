import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Song List</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/songs/:id" element={<h1>Song Detail</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App