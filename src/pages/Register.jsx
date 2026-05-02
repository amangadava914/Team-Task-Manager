import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { registerStart, registerSuccess, registerFailure } from '../features/authSlice'

const Register = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const { isAuthenticated, users, loading, error } = useSelector((state) => state.auth)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const from = location.state?.from?.pathname || '/'

    useEffect(() => {
        document.title = 'Register | Project Management'
    }, [])

    if (isAuthenticated) {
        return <Navigate to={from} replace />
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(registerStart())

        if (password !== confirmPassword) {
            dispatch(registerFailure('Passwords do not match.'))
            return
        }

        if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
            dispatch(registerFailure('An account already exists with this email.'))
            return
        }

        const newUser = {
            id: Date.now(),
            name: name.trim() || 'Project Manager',
            email: email.trim().toLowerCase(),
            password,
        }

        dispatch(registerSuccess(newUser))
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-8">
                <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white mb-2">Create your account</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">Start managing your team, tasks, and projects with an account.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="block">
                        <span className="text-zinc-700 dark:text-zinc-300 text-sm">Full name</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-900"
                        />
                    </label>

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

                    <label className="block">
                        <span className="text-zinc-700 dark:text-zinc-300 text-sm">Confirm password</span>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
