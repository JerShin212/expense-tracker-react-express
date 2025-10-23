import { createContext, useState, useEffect, useContext, Children } from "react";
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser, isAuthenticated, getUser } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated()) {
                try {
                    const userData = getUser();
                    setUser(userData);
                    setIsAuth(true);
                } catch (error) {
                    console.error('Auth check failed: ', error);
                    logoutService();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const data = await loginService(credentials);
            setUser(data.user);
            setIsAuth(true);
            return { success: true, data };
        } catch (error) {
            return { succes: false, error: error.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const data = await registerService(userData);
            setUser(data.user);
            setIsAuth(true);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message || 'Registration failed' };
        }
    }

    const logout = () => {
        logoutService();
        setUser(null);
        setIsAuth(false);
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: isAuth,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}