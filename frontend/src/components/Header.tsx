import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsLoggedIn(false)
        navigate('/')
    }

    const handleLoginClick = async () => {
        try {
            navigate('/login')
        } catch (err) {
            setError('unable to navigate to login page')
        }
    }

    const handleRegisterClick = async () => {
        try {
            navigate('/register')
        } catch (err) {
            setError('unable to navigate to registration page')
        }
    }
    return (
        <header className="site-header">
            <div className="header-container">
                <div className="header-app-name">
                    <a href="/">Furi</a>
                </div>
            
            {!isLoggedIn && (
                <div className="header-buttons">
                <button onClick={handleLoginClick}>Log In</button>
                <button onClick={handleRegisterClick}>Sign Up</button>
            </div>
            )}

            {isLoggedIn && (
                <button onClick={handleLogout}>
                    Log Out
                </button>
            )}
            {error && <p>{error}</p>}
            </div>
        </header>
    )
}