import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from './AuthContext';

const ResidentNotificationContext = createContext();

export const ResidentNotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        if (!user || user.role?.slug !== 'resident') return;
        try {
            const res = await api.get('/user/notifications/unread-count');
            setUnreadCount(res.data.count);
        } catch (error) {
            console.error('Failed to fetch resident unread count', error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, [user]);

    return (
        <ResidentNotificationContext.Provider value={{ unreadCount, fetchUnreadCount }}>
            {children}
        </ResidentNotificationContext.Provider>
    );
};

export const useResidentNotifications = () => useContext(ResidentNotificationContext);
