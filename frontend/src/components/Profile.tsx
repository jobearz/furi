import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import type { User } from "../types"
import { getUserData } from "../api/client"
import Header from "./Header"

export default function Profile() {
    const { id } = useParams()
    const [user, setUser] = useState<Partial<User> | null>(null)
    // edit mode state
    const [isEditing, setIsEditing] = useState(false)
    const [editedUser, setEditedUser] = useState({ ...user })
    
    useEffect(() => {
        if (id) {
            getUserData(id).then(setUser)
        }
    }, [id])

    const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditedUser((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        setUser({ ...editedUser })
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditedUser({ ...user })
        setIsEditing(false)
    }

    return (
        <div className="profile-container">
        <Header></Header>
            <div className="profile-card">
                {isEditing ? (
                    <div className="profile-form">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={editedUser.id}
                            onChange={handleEdit}
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleEdit}
                        />
                        <div className="edit-actions">
                            <button onClick={handleSave}>Save Changes</button>
                            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="profile-display">
                        <h2>{user?.username}</h2>
                        <p className="profile-email">Joined on: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'} </p>
                    </div>
                )}
            </div>
        </div>
    )
}