import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
    LogOut, LayoutDashboard, FileText, Briefcase, Users, Bell, 
    Calendar, Folder, MessageSquare, Radio, BarChart2, Map, 
    ShieldCheck, Settings, FileClock, Search, BellRing, ChevronDown, CheckCircle 
} from 'lucide-react';
import { getImageUrl } from '../../lib/axios';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const { unreadCounts } = useNotifications();
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const sidebarSections = [
        {
            title: 'OVERVIEW',
            items: [
                { path: '/admin', icon: LayoutDashboard, label: 'Overview' },
            ]
        },
        {
            title: 'MANAGE',
            items: [
                { path: '/admin/reports', icon: FileText, label: 'Reports', badge: unreadCounts?.reports || 0 },
                { path: '/admin/services', icon: Briefcase, label: 'Service Requests', badge: unreadCounts?.services || 0 },
                { path: '/admin/residents', icon: Users, label: 'Residents' },
                { path: '/admin/announcements', icon: Bell, label: 'Announcements' },
                { path: '/admin/events', icon: Calendar, label: 'Events' },
                { path: '/admin/documents', icon: Folder, label: 'Documents' },
            ]
        },
        {
            title: 'COMMUNICATION',
            items: [
                { path: '/admin/messages', icon: MessageSquare, label: 'Messages', badge: 5 }, // Example static badge for mockup
                { path: '/admin/broadcast', icon: Radio, label: 'Broadcast' },
            ]
        },
        {
            title: 'ANALYTICS',
            items: [
                { path: '/admin/analytics', icon: BarChart2, label: 'Analytics & Reports' },
                { path: '/admin/heatmap', icon: Map, label: 'Map & Heatmap' },
            ]
        },
        {
            title: 'SYSTEM',
            items: [
                { path: '/admin/users', icon: ShieldCheck, label: 'Users & Roles' },
                { path: '/admin/settings', icon: Settings, label: 'Settings' },
                { path: '/admin/audit', icon: FileClock, label: 'Audit Logs' },
            ]
        }
    ];

    const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen flex bg-[#f8fafc] font-sans relative overflow-hidden text-slate-900">
            {/* Dark Sidebar */}
            <aside className="w-[280px] bg-[#0f3b8e] text-white flex-col hidden md:flex z-10 shrink-0">
                {/* Logo Area */}
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                        <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight tracking-tight text-white">BarangayLink</h1>
                        <p className="text-blue-200 text-xs font-medium">Admin Dashboard</p>
                    </div>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
                    {sidebarSections.map((section, sIdx) => (
                        <div key={sIdx} className="mb-6">
                            <h3 className="px-3 mb-2 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path);
                                    return (
                                        <Link 
                                            key={item.path}
                                            to={item.path} 
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                                                active 
                                                    ? 'bg-[#1e50b5] text-white shadow-sm' 
                                                    : 'text-blue-100 hover:bg-[#1546a3] hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon size={18} strokeWidth={active ? 2.5 : 2} className={active ? "text-white" : "text-blue-300"} /> 
                                                {item.label}
                                            </div>
                                            {item.badge > 0 && (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom Identity Card */}
                <div className="p-4 mt-auto">
                    <div className="bg-[#1546a3] rounded-2xl p-3 flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white p-0.5 shrink-0 overflow-hidden">
                                <img 
                                    src={user?.barangay?.logo_path ? getImageUrl(user.barangay.logo_path) : "/logo.jpg"} 
                                    alt="Barangay Logo" 
                                    className="w-full h-full object-cover rounded-full" 
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-white truncate">{user?.barangay?.name ? `Barangay ${user.barangay.name}` : 'San Isidro'}</p>
                                <p className="text-[10px] text-blue-200 truncate">Municipality of Example</p>
                            </div>
                        </div>
                        <ChevronDown size={14} className="text-blue-300 shrink-0" />
                    </div>
                    <button 
                        onClick={logout} 
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-200 hover:text-white hover:bg-[#1546a3] rounded-xl transition-colors"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>
            
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">
                
                {/* Header */}
                <header className="h-20 bg-[#f8fafc] flex items-center justify-between px-8 shrink-0 z-20 w-full pt-4">
                    {/* Greeting */}
                    <div className="flex-1">
                        <h2 className="font-bold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
                            Good morning, {user?.first_name || 'Admin'}! <span className="text-2xl">👋</span>
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">
                            Here's what's happening in Barangay {user?.barangay?.name || 'San Isidro'} today.
                        </p>
                    </div>
                    
                    {/* Right Controls */}
                    <div className="flex items-center gap-6">
                        {/* Search */}
                        <div className="relative hidden lg:block w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search reports, requests, residents..." 
                                className="w-full bg-white border border-slate-200 text-sm rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                            />
                        </div>
                        
                        {/* Notifications */}
                        <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white rounded-full shadow-sm border border-slate-100">
                            <BellRing size={20} />
                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center leading-none">3</span>
                        </button>
                        
                        {/* Admin Profile */}
                        <div className="flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-full shadow-sm border border-slate-100 cursor-pointer hover:border-slate-300 transition-all">
                            <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200">
                                {user?.profile_photo_path ? (
                                    <img src={getImageUrl(user.profile_photo_path)} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                        {user?.first_name?.charAt(0) || 'A'}
                                    </div>
                                )}
                            </div>
                            <div className="hidden sm:block text-left pr-2">
                                <p className="text-sm font-bold text-slate-900 leading-none">{user?.first_name || 'Admin'} {user?.last_name || 'User'}</p>
                                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{user?.role?.name || 'Super Administrator'}</p>
                            </div>
                            <ChevronDown size={14} className="text-slate-400" />
                        </div>
                    </div>
                </header>
                
                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-auto p-8 pt-6 pb-20">
                    <Outlet />
                    
                    {/* Footer */}
                    <div className="mt-12 flex items-center justify-between text-xs font-medium text-slate-400 border-t border-slate-200 pt-6 pb-2">
                        <p>© 2026 BarangayLink. All rights reserved.</p>
                        <p>Version 1.0.0</p>
                    </div>
                </div>
            </main>
            
            {/* Custom scrollbar styles */}
            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
            `}} />
        </div>
    );
}
