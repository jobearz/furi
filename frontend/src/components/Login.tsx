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
      navigate('/dashboard')
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
    <div className='login-container'>
      <div className='login-card'>
        <h1 className='login-title'>Login</h1>
        <h2 className='email-field'>Email:</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <h2 className='password-field'>Password:</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <p className='forgot-password'>Forgot password? <a href="https://example.com">Click here!</a></p>
        <div className='button-row'>
          <button onClick={handleLogin}>Login</button>
          <button className='btn-secondary' onClick={handleRegister}>Register</button>
        </div>
        {error && <p>{error}</p>}
      </div>
    </div>
  )
}