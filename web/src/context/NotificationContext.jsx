import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [unreadCounts, setUnreadCounts] = useState({
        services: 0,
        emergencies: 0,
        reports: 0
    });

    useEffect(() => {
        if (!user || (user.role && user.role.slug !== 'barangay-admin' && user.role.slug !== 'super-admin')) {
            return;
        }

        const fetchCounts = async () => {
            try {
                const response = await api.get('/notifications/unread-count');
                setUnreadCounts(response.data);
            } catch (error) {
                console.error('Failed to fetch notification counts', error);
            }
        };

        fetchCounts();
        const intervalId = setInterval(fetchCounts, 10000);

        return () => clearInterval(intervalId);
    }, [user]);

    return (
        <NotificationContext.Provider value={{ unreadCounts }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
