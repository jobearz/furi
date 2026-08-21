import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "../types";
import { getUserData } from "../api/client";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<Partial<User> | null>(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('user_id')
        setIsLoggedIn(!!token)
        if (userId) {
            getUserData(userId).then(setUser)
        }
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

    const handleProfileClick = async () => {
        try {
            navigate(`/users/${user?.id}`)
        } catch (err) {
            setError('unable to navigate to profile page')
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
                <div className="header-buttons">
                    <p>{user?.username}</p>
                    <button onClick={handleProfileClick}>
                        Profile
                    </button>
                    <button onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            )}
            {error && <p>{error}</p>}
            </div>
        </header>
    )
}