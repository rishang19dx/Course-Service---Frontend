import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  isAuthenticated: boolean;
  userRole: 'admin' | 'faculty' | 'student' | null;
  userId: string | null;
  login: (userId: string, role: 'admin' | 'faculty' | 'student') => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userRole: null,
      userId: null,
      login: (userId, role) => set({ isAuthenticated: true, userId, userRole: role }),
      logout: () => set({ isAuthenticated: false, userId: null, userRole: null }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore; 