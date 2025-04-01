import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const login = (username, password) => {
        // Dans une application réelle, vous appelleriez une API ici
        // Ceci est une simple simulation
        if (username === 'user' && password === 'password') {
            setCurrentUser({ username });
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};