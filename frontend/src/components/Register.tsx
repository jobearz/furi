import React from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { registerUser } from '../api/client'
import { useNavigate } from "react-router-dom"

interface RegisterFormData {
        username: string
        email: string
        password: string
        confirmPassword: string
}

export const Register: React.FC = () => {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>()

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        console.log("Registration Data:", data)
        try {
            await registerUser(data.username, data.email, data.password)
            navigate('/songs')
        } catch (err) {
            console.error('failed to register')
        }
    }

    const password = watch("password")

    return (
        <div className="register-container">
            <div className="register-form">
                <h1 className="register-title">Create an Account</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="registration-input">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            {...register("username", { required: "Username is required"})}
                        />
                        { errors.username &&
                        <p>{errors.username.message}</p>
                        }
                    </div>
                    <div className="registration-input">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                
                        />
                        { errors.email &&
                        <p>{errors.email.message}</p>
                        }
                    </div>
                    <div className="registration-input">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters"}
                            })}
                        />
                        { errors.password &&
                        <p>{errors.password.message}</p>
                        }
                    </div>
                    <div className="registration-input">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) => value === password || "Passwords do not match"
                            })}
                        />
                        { errors.confirmPassword &&
                        <p>{errors.confirmPassword.message}</p>
                        }
                    </div>
                    <div className="submit-button">
                        <button type="submit">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}