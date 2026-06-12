import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('invalid email or password')
    }
  }

  const handleRegister = async () => {
    try {
      await register(email, password)
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('failed to register')
    }
  } 

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
      {error && <p>{error}</p>}
    </div>
  )
}