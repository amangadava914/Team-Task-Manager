import { createSlice } from '@reduxjs/toolkit'

const storedUser = JSON.parse(localStorage.getItem('projectAuthUser')) || null
const storedUsers = JSON.parse(localStorage.getItem('projectAuthUsers')) || []

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    users: storedUsers,
    loading: false,
    error: null,
    isAuthenticated: Boolean(storedUser),
  },
  reducers: {
    loginStart(state) {
      state.loading = true
      state.error = null
    },
    loginSuccess(state, action) {
      state.loading = false
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
      localStorage.setItem('projectAuthUser', JSON.stringify(action.payload))
    },
    loginFailure(state, action) {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('projectAuthUser')
    },
    registerStart(state) {
      state.loading = true
      state.error = null
    },
    registerSuccess(state, action) {
      state.loading = false
      state.users.push(action.payload)
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
      localStorage.setItem('projectAuthUsers', JSON.stringify(state.users))
      localStorage.setItem('projectAuthUser', JSON.stringify(action.payload))
    },
    registerFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
} = authSlice.actions

export default authSlice.reducer
