import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Map as MapIcon, User as UserIcon, Bell, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useResidentNotifications } from '../../context/ResidentNotificationContext';
import BottomNavigation from '../../components/layout/BottomNavigation';

export default function ResidentLayout() {
    const location = useLocation();
    const { user } = useAuth();
    const { unreadCount } = useResidentNotifications();

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* Top Header removed in favor of page-specific headers */}

            <Outlet />
            
            <BottomNavigation />
        </div>
    );
}
