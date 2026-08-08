import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { LogOut, LayoutDashboard, FileText, Briefcase, AlertTriangle, Bell, User, Settings } from 'lucide-react';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const { unreadCounts } = useNotifications();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/reports', icon: FileText, label: 'Reports', badge: unreadCounts?.reports || 0 },
        { path: '/admin/services', icon: Briefcase, label: 'Services', badge: unreadCounts?.services || 0 },
        { path: '/admin/emergencies', icon: AlertTriangle, label: 'Emergencies', alert: true, badge: unreadCounts?.emergencies || 0 },
        { path: '/admin/announcements', icon: Bell, label: 'Announcements' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans relative overflow-hidden">
            {/* Subtle Premium Background Tint */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-50/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
            </div>

            {/* Sidebar */}
            <aside className="w-72 bg-white/80 backdrop-blur-2xl border-r border-slate-100 hidden md:flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 m-4 rounded-3xl overflow-hidden relative">
                <div className="p-8 border-b border-slate-100/50 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-center p-[2px] border border-slate-100 mb-4 overflow-hidden">
                        <img 
                            src={user?.barangay?.logo_path ? `http://127.0.0.1:8000/${user.barangay.logo_path}` : "/logo.jpg"} 
                            alt="Barangay Logo" 
                            className="w-full h-full object-contain rounded-[14px]" 
                        />
                    </div>
                    <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">{user?.barangay?.name ? `Brgy. ${user.barangay.name}` : 'BarangayLink'}</h1>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 bg-blue-50 px-2.5 py-1 rounded-full">Admin Portal</span>
                </div>
                
                <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link 
                                key={item.path}
                                to={item.path} 
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 ${
                                    active 
                                        ? item.alert 
                                            ? 'bg-red-50 text-red-600 shadow-[0_4px_12px_rgba(239,68,68,0.1)]' 
                                            : 'bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)]'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    <Icon size={20} strokeWidth={active ? 2.5 : 2} className={active && !item.alert ? "text-white" : ""} /> 
                                    {item.label}
                                </div>
                                {item.badge > 0 && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active && !item.alert ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-5 border-t border-slate-100/50 bg-white/50 backdrop-blur-md">
                    <button 
                        onClick={logout} 
                        className="w-full flex items-center justify-center gap-2 p-3 text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>
            
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">
                {/* Header */}
                <header className="h-20 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 flex items-center justify-between px-8 shrink-0 sticky top-0 z-20 m-4 ml-0 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                    <h2 className="font-bold text-2xl text-slate-900 capitalize tracking-tight">
                        {location.pathname === '/admin' ? 'Dashboard Overview' : location.pathname.split('/').pop()}
                    </h2>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 leading-none">{user?.first_name} {user?.last_name}</p>
                            <p className="text-xs font-medium text-slate-500 mt-1">{user?.role.name}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600">
                            <User size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                </header>
                
                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-auto p-4 pt-0 pl-0">
                    <div className="h-full bg-transparent">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
