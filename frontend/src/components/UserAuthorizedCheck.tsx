import { createContext, useContext, useState, type ReactNode } from "react"

interface AuthContextType {
    token: string | null;
    userIsAuthenticated: boolean;
    login: (newToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthorizedContent {
    children: ReactNode
}

export const UserAuthorizedCheck = ({ children }: AuthorizedContent) => {
    // fetch token
    const [token, setToken] = useState<string | null>(
        typeof window !== 'undefined' ? localStorage.getItem('token') : null
    )

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
    }

    // boolean for token
    const userIsAuthenticated = !!token

    return (
        <AuthContext.Provider value={{ token, userIsAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within a user authorization check')
    }

    return context;
}