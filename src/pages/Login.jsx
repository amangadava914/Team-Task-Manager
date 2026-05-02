import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { loginStart, loginSuccess, loginFailure } from '../features/authSlice'

const Login = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const { isAuthenticated, users, loading, error } = useSelector((state) => state.auth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const from = location.state?.from?.pathname || '/'

    useEffect(() => {
        document.title = 'Login | Project Management'
    }, [])

    if (isAuthenticated) {
        return <Navigate to={from} replace />
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(loginStart())

        const foundUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase())
        if (!foundUser) {
            dispatch(loginFailure('User not found. Please register first.'))
            return
        }

        if (foundUser.password !== password) {
            dispatch(loginFailure('Invalid credentials.'))
            return
        }

        dispatch(loginSuccess(foundUser))
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-8">
                <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white mb-2">Welcome back</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">Sign in to continue managing your projects.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="block">
                        <span className="text-zinc-700 dark:text-zinc-300 text-sm">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-900"
                        />
                    </label>

                    <label className="block">
                        <span className="text-zinc-700 dark:text-zinc-300 text-sm">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-900"
                        />
                    </label>

                    {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    New here?{' '}
                    <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
