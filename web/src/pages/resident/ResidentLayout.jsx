import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Map as MapIcon, User as UserIcon, Bell, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useResidentNotifications } from '../../context/ResidentNotificationContext';

export default function ResidentLayout() {
    const location = useLocation();
    const { user } = useAuth();
    const { unreadCount } = useResidentNotifications();

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-20">
            {/* Top Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
                <div className="flex justify-between items-center h-16 px-5 max-w-lg mx-auto">
                    <div className="flex items-center gap-3">
                        <img src={user?.barangay?.logo_path ? (user.barangay.logo_path.startsWith('http') ? user.barangay.logo_path : `${import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '')}/${user.barangay.logo_path}`) : '/logo.jpg'} alt="Logo" className="w-8 h-8 object-contain" onError={(e) => { e.target.src = '/logo.jpg'; }} />
                        <div>
                            <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none">BarangayLink</h1>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{user?.barangay?.name || 'Resident App'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to="/resident/sos" className="relative p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors text-red-600 shadow-sm">
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-red-100 animate-ping opacity-75"></span>
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-red-100"></span>
                            <AlertTriangle size={18} strokeWidth={2.5} />
                        </Link>
                        <Link to="/resident/notifications" className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
                            <Bell size={20} strokeWidth={2.5} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm ring-2 ring-red-500/20 animate-pulse"></span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            <Outlet />
            
            <div className="fixed bottom-0 left-0 w-full z-50 px-5 pb-[env(safe-area-inset-bottom,1rem)] mb-4 pointer-events-none">
                <nav className="max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-full pointer-events-auto">
                    <div className="flex justify-around items-center h-[65px] px-2 py-1">
                        <Link to="/resident" className={`flex flex-col items-center justify-center w-[72px] h-full gap-1 transition-colors ${location.pathname === '/resident' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            <div className={`flex items-center justify-center rounded-2xl transition-all duration-300 ${location.pathname === '/resident' ? 'bg-blue-100/80 w-14 h-8' : 'bg-transparent w-8 h-8'}`}>
                                <Home size={22} strokeWidth={location.pathname === '/resident' ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-bold">Home</span>
                        </Link>
                        <Link to="/resident/reports" className={`flex flex-col items-center justify-center w-[72px] h-full gap-1 transition-colors ${location.pathname === '/resident/reports' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            <div className={`flex items-center justify-center rounded-2xl transition-all duration-300 ${location.pathname === '/resident/reports' ? 'bg-blue-100/80 w-14 h-8' : 'bg-transparent w-8 h-8'}`}>
                                <FileText size={22} strokeWidth={location.pathname === '/resident/reports' ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-bold">Reports</span>
                        </Link>
                        <Link to="/resident/map" className={`flex flex-col items-center justify-center w-[72px] h-full gap-1 transition-colors ${location.pathname === '/resident/map' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            <div className={`flex items-center justify-center rounded-2xl transition-all duration-300 ${location.pathname === '/resident/map' ? 'bg-blue-100/80 w-14 h-8' : 'bg-transparent w-8 h-8'}`}>
                                <MapIcon size={22} strokeWidth={location.pathname === '/resident/map' ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-bold">Map</span>
                        </Link>
                        <Link to="/resident/profile" className={`flex flex-col items-center justify-center w-[72px] h-full gap-1 transition-colors ${location.pathname === '/resident/profile' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            <div className={`flex items-center justify-center rounded-2xl transition-all duration-300 ${location.pathname === '/resident/profile' ? 'bg-blue-100/80 w-14 h-8' : 'bg-transparent w-8 h-8'}`}>
                                <UserIcon size={22} strokeWidth={location.pathname === '/resident/profile' ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-bold">Profile</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    );
}
