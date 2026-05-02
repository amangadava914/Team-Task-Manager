import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MoonIcon, SunIcon, UserIcon, BellIcon, ShieldIcon } from 'lucide-react'
import { toggleTheme } from '../features/themeSlice'
import { logout } from '../features/authSlice'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { theme } = useSelector((state) => state.theme)
    const { user } = useSelector((state) => state.auth)

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        taskUpdates: true,
        projectUpdates: true,
    })

    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: '',
    })

    const handleProfileUpdate = (e) => {
        e.preventDefault()
        // In a real app, this would update the user profile
        alert('Profile updated successfully!')
    }

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Profile Settings */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <UserIcon className="size-5 text-zinc-600 dark:text-zinc-400" />
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Profile</h2>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Bio
                            </label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                        >
                            Update Profile
                        </button>
                    </form>
                </div>

                {/* Appearance Settings */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                        {theme === 'light' ? (
                            <SunIcon className="size-5 text-yellow-500" />
                        ) : (
                            <MoonIcon className="size-5 text-blue-500" />
                        )}
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Appearance</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                                Theme
                            </label>
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className="flex items-center gap-3 w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
                            >
                                {theme === 'light' ? (
                                    <MoonIcon className="size-5 text-zinc-600 dark:text-zinc-400" />
                                ) : (
                                    <SunIcon className="size-5 text-yellow-500" />
                                )}
                                <span className="text-zinc-900 dark:text-zinc-100">
                                    {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <BellIcon className="size-5 text-zinc-600 dark:text-zinc-400" />
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </label>
                                <button
                                    onClick={() => setNotifications({ ...notifications, [key]: !value })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${value ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${value ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldIcon className="size-5 text-zinc-600 dark:text-zinc-400" />
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Security</h2>
                    </div>

                    <div className="space-y-4">
                        <button className="w-full text-left p-3 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition">
                            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Change Password</div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">Update your account password</div>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full text-left p-3 border border-red-300 dark:border-red-700 rounded-md bg-white dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                            <div className="text-sm font-medium text-red-700 dark:text-red-300">Logout</div>
                            <div className="text-xs text-red-500 dark:text-red-400">Sign out of your account</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings