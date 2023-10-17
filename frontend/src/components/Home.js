import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { currentUser, logout } = useAuth();

    return (
        <div>
            {currentUser ? (
                <>
                    <h1>Welcome, {currentUser.username}!</h1>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <h1>Please login or register.</h1>
            )}
        </div>
    );
};

export default Home;