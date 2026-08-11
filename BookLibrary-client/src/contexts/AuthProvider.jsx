import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../supabaseClient';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data;
    };

    const LogIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const LogOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const updateUser = async (updatedData) => {
        const { data, error } = await supabase.auth.updateUser({
            data: {
                display_name: updatedData.displayName,
                avatar_url: updatedData.photoURL
            }
        });
        if (error) throw error;
        
        setUser(prev => prev ? {
            ...prev,
            displayName: updatedData.displayName || prev.displayName,
            photoURL: updatedData.photoURL || prev.photoURL
        } : null);
        return data;
    };

    const GoogleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
        return data;
    };

    useEffect(() => {
        const syncProfile = async (session) => {
            if (!session) return;
            const mappedUser = {
                ...session.user,
                email: session.user.email,
                displayName: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || '',
                photoURL: session.user.user_metadata?.avatar_url || '',
                accessToken: session.access_token
            };
            
            try {
                const userInfo = {
                    name: mappedUser.displayName || 'User',
                    email: mappedUser.email,
                    photoURL: mappedUser.photoURL,
                    role: "user"
                };
                await fetch(`${import.meta.env.VITE_BASE_URL}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify(userInfo)
                });
            } catch (err) {
                console.error("Failed to automatically sync user profile:", err);
            }
        };

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                const mappedUser = {
                    ...session.user,
                    email: session.user.email,
                    displayName: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || '',
                    photoURL: session.user.user_metadata?.avatar_url || '',
                    accessToken: session.access_token
                };
                setUser(mappedUser);
                syncProfile(session);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                const mappedUser = {
                    ...session.user,
                    email: session.user.email,
                    displayName: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || '',
                    photoURL: session.user.user_metadata?.avatar_url || '',
                    accessToken: session.access_token
                };
                setUser(mappedUser);
                if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                    syncProfile(session);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const AuthInfo = {
        user,
        setUser,
        loading,
        setLoading,
        signUp,
        LogIn,
        LogOut,
        GoogleLogin,
        updateUser,
    };
    return (
        <AuthContext.Provider value={AuthInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;