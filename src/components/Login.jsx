import React, { useState } from "react"
import { app } from '../firebase'
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail
} from "firebase/auth"

import earthIcon from '../assets/earth-icon.png'
import passwordVisible from '../assets/password-visible.png'
import passwordHidden from '../assets/password-hidden.png'

const Login = ({ setIsUserLoggedIn }) => {
    const [createAccount, setCreateAccount] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState({type: '', text: ''})
    const [showResendButton, setShowResendButton] = useState(false)
    const [showResetPassword, setShowResetPassword] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const validatePassword = () => {
        if (password !== confirmPassword) {
            setMessage({type: 'error', text: 'Passwords do not match.'})
            return false
        } else {
            return true
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        if (!validatePassword()) {
            return
        }
        const auth = getAuth()
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            await updateProfile(user, { displayName: username })
            await sendEmailVerification(user)
            setMessage({type: 'success', text: 'Account created successfully! Please verify your email address.'})
            setCurrentUser(user)
            clearFormFields()
            setCreateAccount(false)
        } catch (error) {
            const errorMessage = getFriendlyErrorMessage(error.code)
            setMessage({type: 'error', text: errorMessage})
        }
    }

    const handleSignin = async (e) => {
        e.preventDefault()
        const auth = getAuth()
        try {

            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            if (!user.emailVerified) {
                setMessage({type: 'error', text: 'Please verify your email address before signing in.'})
                setShowResendButton(true)
                setCurrentUser(user)
                await auth.signOut()
                setIsUserLoggedIn(false)
            } else {
                setMessage({type: 'success', text: 'Signed in successfully!'})
                setShowResendButton(false)
                clearFormFields()
                setIsUserLoggedIn(true)
            }
        } catch (error) {
            console.log(error)
            const errorMessage = getFriendlyErrorMessage(error.code)
            setMessage({type: 'error', text: errorMessage})
        }
    }

    const handleResendVerification = async () => {
        if (currentUser && !currentUser.emailVerified) {
            try {
                await sendEmailVerification(currentUser)
                setMessage({type: 'success', text: 'Verification email resent. Please check your inbox.'})
            } catch (error) {
                setMessage('Failed to resend verification email. Please try again later.')
            }
        } else {
            setMessage('No user is signed in or email is already verified.')
        }
    }

    const handleResetPassword = async () => {
        const auth = getAuth()
        try {
            await sendPasswordResetEmail(auth, email)
            setMessage({type: 'success', text: 'Password reset email sent!'})
        } catch (error) {
            setMessage({type: 'error', text: 'Failed to send password reset email. Please try again later.'})
            console.log(error.code, error.message)
        }
    }

    const clearFormFields = () => {
        setUsername('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
    }

    const getFriendlyErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'This email is already in use.'
            case 'auth/invalid-email':
                return 'The email address is not valid.'
            case 'auth/weak-password':
                return 'The password is too weak. Please use at least 6 characters.'
            case 'auth/invalid-credential':
                return 'The provided credentials are invalid. Please check and try again.'
            case 'auth/missing-password':
                return 'The password is missing. Please enter your password.'
            default:
                return 'An unexpected error occurred. Please try again.'
        }
    }

    const handleCreateAccountBtn = () => {
        if (createAccount) {
            setMessage('')
            clearFormFields()
            setIsPasswordVisible(false)
            setCreateAccount(false)
            setShowResetPassword(true)
        } else {
            setShowResendButton(false)
            setMessage('')
            clearFormFields()
            setIsPasswordVisible(false)
            setCreateAccount(true)
            setShowResetPassword(false)
        }
    }
        
    return (
        <div className="login">
            <div className="login__card">
                <div className="loginGreeting">
                    <h1><img src={earthIcon} />Welcome to JourneyPins!<img src={earthIcon} /></h1>
                    <h2>Sign in or create an account to track your adventures and save your memories.</h2>
                </div>
                {message.text && <span className={`message ${message.type}`}>{message.text}</span>}
                {createAccount ? (
                    <form className="loginForm signupForm" onSubmit={handleSignup}>
                        <div>
                            <label className="loginForm__label" htmlFor="name">Name</label>
                            <input className="loginForm__input"
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Peter"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="loginForm__label" htmlFor="email">Email</label>
                            <input className="loginForm__input"
                                type="email"
                                name="email"
                                id="email"
                                placeholder="example@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="loginForm__label" htmlFor="create-password">Create password</label>
                            <div className="loginForm__input-container">
                                <input className="loginForm__input"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    name="create-password"
                                    id="create-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <img
                                    className="show-password-btn"
                                    src={isPasswordVisible ? passwordHidden : passwordVisible}
                                    alt={isPasswordVisible ? 'Hide password' : 'Show password'}
                                    role="button"
                                    aria-pressed={isPasswordVisible}
                                    aria-controls="password"
                                    tabIndex={0}
                                    onClick={() => setIsPasswordVisible(prev => !prev)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            setIsPasswordVisible(prev => !prev)
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="loginForm__label" htmlFor="confirm-password">Confirm password</label>
                            <div className='loginForm__input-container'>
                                <input className="loginForm__input"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    name="confirm-password"
                                    id="confirm-password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <img
                                    className="show-password-btn"
                                    src={isPasswordVisible ? passwordHidden : passwordVisible}
                                    alt={isPasswordVisible ? 'Hide password' : 'Show password'}
                                    role="button"
                                    aria-pressed={isPasswordVisible}
                                    aria-controls="password"
                                    tabIndex={0}
                                    onClick={() => setIsPasswordVisible(prev => !prev)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            setIsPasswordVisible(prev => !prev)
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <button className="loginForm__btn signupForm__btn" type="submit">Sign Up</button>
                    </form>
                ) : (
                    <form className="loginForm" onSubmit={handleSignin}>
                        <label className="loginForm__label" htmlFor="email">Email</label>
                        <input
                            className="loginForm__input"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="example@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="loginForm__label" htmlFor="password">Password</label>
                        <div className="loginForm__input-container">
                            <input
                                className="loginForm__input"
                                type={isPasswordVisible ? 'text' : 'password'}
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <img
                                className="show-password-btn"
                                src={isPasswordVisible ? passwordHidden : passwordVisible}
                                alt={isPasswordVisible ? 'Hide password' : 'Show password'}
                                role="button"
                                aria-pressed={isPasswordVisible}
                                aria-controls="password"
                                tabIndex={0}
                                onClick={() => setIsPasswordVisible(prev => !prev)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setIsPasswordVisible(prev => !prev)
                                    }
                                }}
                            />
                        </div>
                        <button className="loginForm__btn" type="submit">Sign In</button>
                    </form>
                )}
                <div className="other-buttons">
                    {showResendButton ? (
                        <button className="resendVerification-btn" onClick={handleResendVerification}>Resend verification email</button>
                    ) : 
                    email && showResetPassword && (
                        <button className='resetPassword-btn' onClick={handleResetPassword}>Reset password</button>
                    )}
                    <button className="createAccount-btn" onClick={handleCreateAccountBtn}>{createAccount ? 'Sign in' : 'Create new account'}</button>
                </div>
            </div>
        </div>
    )
}

export default Login