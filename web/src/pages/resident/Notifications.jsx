import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, AlertCircle, FileText, Briefcase, Check, Sparkles } from 'lucide-react';
import api from '../../lib/axios';
import { useResidentNotifications } from '../../context/ResidentNotificationContext';
import Header from '../../components/layout/Header';

export default function ResidentNotifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const { fetchUnreadCount } = useResidentNotifications();

    const TABS = ['All', 'Announcements', 'Reports', 'Services', 'Emergency'];

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const res = await api.get('/user/notifications');
            setNotifications(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load notifications', err);
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/user/notifications/${id}/read`);
            setNotifications(notifications.map(n => 
                n.id === id ? { ...n, read_at: new Date().toISOString() } : n
            ));
            fetchUnreadCount();
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/user/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
            fetchUnreadCount();
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    };

    const getIcon = (type) => {
        if (type === 'Service') return <Briefcase size={20} className="text-blue-600" />;
        if (type === 'Report') return <AlertCircle size={20} className="text-amber-600" />;
        if (type === 'ai_proactive_alert') return <Sparkles size={20} className="text-violet-600" />;
        return <Bell size={20} className="text-slate-600" />;
    };

    const getBgColor = (type) => {
        if (type === 'Service') return 'bg-blue-100';
        if (type === 'Report') return 'bg-amber-100';
        if (type === 'ai_proactive_alert') return 'bg-violet-100';
        return 'bg-slate-100';
    };

    const handleNotificationClick = async (n) => {
        const isUnread = !n.read_at;
        if (isUnread) {
            await markAsRead(n.id);
        }
        
        if (n.data?.type === 'ai_proactive_alert') {
            navigate('/resident/sos', { state: { aiMessage: n.data.message } });
        }
    };

    if (loading) {
        return (
            <div className="max-w-lg mx-auto p-6 flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.read_at).length;
    
    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'All') return true;
        const type = n.data?.type || '';
        if (activeTab === 'Announcements' && type === 'Announcement') return true;
        if (activeTab === 'Reports' && type === 'Report') return true;
        if (activeTab === 'Services' && type === 'Service') return true;
        if (activeTab === 'Emergency' && (type === 'Emergency' || type === 'ai_proactive_alert')) return true;
        return false;
    });

    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            <Header 
                title="Notifications" 
                rightAction={
                    unreadCount > 0 && (
                        <button 
                            onClick={markAllAsRead}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                        >
                            <Check size={14} /> Mark all read
                        </button>
                    )
                }
            />

            <div className="max-w-lg mx-auto p-5">
                
                {/* Horizontal Scrollable Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-2 snap-x hide-scrollbar -mx-6 px-6">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === tab ? 'bg-slate-800 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center p-12 text-slate-500 font-medium text-sm bg-white rounded-3xl border border-dashed border-slate-300">
                            <Bell className="mx-auto mb-3 opacity-20" size={32} />
                            No notifications in this category.
                        </div>
                ) : (
                    filteredNotifications.map(n => {
                        const data = n.data || {};
                        const isUnread = !n.read_at;

                        return (
                            <div 
                                key={n.id}
                                onClick={() => handleNotificationClick(n)}
                                className={`bg-white rounded-3xl p-5 transition-all border ${isUnread ? 'border-blue-200 shadow-[0_8px_30px_rgba(37,99,235,0.08)] cursor-pointer' : 'border-slate-100 opacity-70 cursor-pointer'} flex gap-4 items-start`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getBgColor(data.type)}`}>
                                    {getIcon(data.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`text-sm font-bold ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {data.type === 'ai_proactive_alert' ? data.title || 'AI Assistant' : `${data.type} Update`}
                                        </h3>
                                        <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-2">
                                            {new Date(n.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm ${isUnread ? 'text-slate-700 font-medium' : 'text-slate-500'} leading-relaxed`}>
                                        {data.message}
                                    </p>
                                </div>
                                {isUnread && (
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                                )}
                            </div>
                        );
                    })
                )}
                </div>
            </div>
        </div>
    );
}
