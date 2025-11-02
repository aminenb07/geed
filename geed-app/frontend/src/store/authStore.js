import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'
import toast from 'react-hot-toast'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Login
      login: async (credentials) => {
        try {
          const response = await api.post('/auth/login', credentials)
          const { user, token } = response.data
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          
          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          toast.success('Login successful!')
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Register
      register: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData)
          const { user, token } = response.data
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          
          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          toast.success('Registration successful!')
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Logout
      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
          
          // Remove token from API headers
          delete api.defaults.headers.common['Authorization']
          
          toast.success('Logged out successfully')
        }
      },

      // Check authentication status
      checkAuth: async () => {
        const { token } = get()
        
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          const response = await api.get('/auth/me')
          const { user } = response.data
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          console.error('Auth check failed:', error)
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
          
          // Remove token from API headers
          delete api.defaults.headers.common['Authorization']
        }
      },

      // Update profile
      updateProfile: async (profileData) => {
        try {
          const response = await api.put('/auth/profile', profileData)
          const { user } = response.data
          
          set({ user })
          
          toast.success('Profile updated successfully!')
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Profile update failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Change password
      changePassword: async (passwordData) => {
        try {
          await api.put('/auth/change-password', passwordData)
          toast.success('Password changed successfully!')
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Password change failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Clear auth state
      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
        delete api.defaults.headers.common['Authorization']
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export { useAuthStore }