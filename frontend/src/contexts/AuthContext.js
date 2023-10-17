import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const token = localStorage.getItem('token');
        return token ? token : null;
    });

    const login = (token) => {
        setCurrentUser(token);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        // When the application loads, we get the token from localStorage
        // and save it in the context to keep the user authenticated
        const token = localStorage.getItem('token');
        if (token) {
            setCurrentUser(token);
        }
    }, []);

    const contextValue = {
        currentUser,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
