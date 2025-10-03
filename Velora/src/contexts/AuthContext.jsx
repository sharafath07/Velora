import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext(undefined);

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: true,
    isAuthenticated: false,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                isLoading: true,
            };
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isLoading: false,
                isAuthenticated: true,
            };
        case 'LOGIN_FAILURE':
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
                isLoading: false,
                isAuthenticated: false,
            };
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
                isLoading: false,
                isAuthenticated: false,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            payload: { user: data.data, token },
                        });
                    } else {
                        dispatch({ type: 'LOGIN_FAILURE' });
                    }
                } catch (error) {
                    dispatch({ type: 'LOGIN_FAILURE' });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        dispatch({ type: 'LOGIN_START' });

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { user: data.user, token: data.token },
                });
            } else {
                dispatch({ type: 'LOGIN_FAILURE' });
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            dispatch({ type: 'LOGIN_FAILURE' });
            throw error;
        }
    };

    const register = async (userData) => {
        dispatch({ type: 'LOGIN_START' });

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { user: data.user, token: data.token },
                });
            } else {
                dispatch({ type: 'LOGIN_FAILURE' });
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            dispatch({ type: 'LOGIN_FAILURE' });
            throw error;
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${state.token}`,
                },
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch({ type: 'LOGOUT' });
        }
    };

    const updateProfile = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/updateprofile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.token}`,
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: 'UPDATE_USER', payload: data.data });
            } else {
                throw new Error(data.message || 'Profile update failed');
            }
        } catch (error) {
            throw error;
        }
    };

    const updatePassword = async (currentPassword, newPassword) => {
        try {
            const response = await fetch(`${API_URL}/auth/updatepassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { user: data.user, token: data.token },
                });
            } else {
                throw new Error(data.message || 'Password update failed');
            }
        } catch (error) {
            throw error;
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await fetch(`${API_URL}/auth/forgotpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Password reset failed');
            }
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                state,
                login,
                register,
                logout,
                updateProfile,
                updatePassword,
                forgotPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
