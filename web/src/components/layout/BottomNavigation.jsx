import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Briefcase, User as UserIcon } from 'lucide-react';

export default function BottomNavigation() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 px-5 pb-[env(safe-area-inset-bottom,1rem)] mb-4 pointer-events-none">
            <nav className="relative max-w-md mx-auto bg-white/95 backdrop-blur-xl shadow-[0_-4px_30px_rgba(0,0,0,0.05)] rounded-[2.5rem] pointer-events-auto border border-slate-100">
                <div className="flex justify-around items-end h-[72px] px-2 py-2">
                    <Link to="/resident" className={`flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-colors ${isActive('/resident') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Home size={24} strokeWidth={isActive('/resident') ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">Home</span>
                    </Link>
                    <Link to="/resident/reports" className={`flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-colors ${isActive('/resident/reports') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <FileText size={24} strokeWidth={isActive('/resident/reports') ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">Reports</span>
                    </Link>

                    {/* SOS Button */}
                    <Link to="/resident/sos" className="flex flex-col items-center justify-center w-[20%] h-full transition-colors">
                        <div className="w-12 h-12 mb-1 rounded-full bg-red-600 shadow-md flex items-center justify-center text-white hover:bg-red-700 active:scale-95 transition-all">
                            <span className="font-black text-xs tracking-widest">SOS</span>
                        </div>
                    </Link>

                    <Link to="/resident/services" className={`flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-colors ${isActive('/resident/services') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Briefcase size={24} strokeWidth={isActive('/resident/services') ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">Services</span>
                    </Link>
                    <Link to="/resident/profile" className={`flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-colors ${isActive('/resident/profile') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <UserIcon size={24} strokeWidth={isActive('/resident/profile') ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">Profile</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
