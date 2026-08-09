import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, FileText, AlertTriangle, Bell, Clock, Sun, Moon, CloudSun, CloudRain, MapPin, Thermometer, ChevronRight, Compass, Briefcase, Sparkles, HeartPulse, User as UserIcon, Building, Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import StatusBadge from '../../components/ui/StatusBadge';

export default function ResidentDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // Data States
    const [announcements, setAnnouncements] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    
    // Twist States
    const [locationState, setLocationState] = useState(localStorage.getItem('locationState') || 'prompt'); // 'prompt', 'loading', 'granted', 'denied'
    const [weatherData, setWeatherData] = useState(JSON.parse(localStorage.getItem('weatherData')) || null);
    const [timeContext, setTimeContext] = useState({ greeting: 'Welcome', icon: Sun, gradient: 'from-blue-500 to-sky-400' });

    useEffect(() => {
        // Fetch Dashboard Data
        const fetchData = async () => {
            try {
                const [annRes, repRes, srvRes] = await Promise.all([
                    api.get('/announcements'),
                    api.get('/reports'),
                    api.get('/service-requests')
                ]);
                setAnnouncements(annRes.data.slice(0, 3));
                const activities = [
                    ...repRes.data.map(r => ({ ...r, type: 'Report', icon: AlertTriangle, color: 'text-warning' })),
                    ...srvRes.data.map(s => ({ ...s, title: s.service_type?.name, type: 'Service Request', icon: FileText, color: 'text-info' }))
                ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
                setRecentActivity(activities);
            } catch (error) {
                console.error("Failed to load dashboard data");
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();

        // Time of Day Logic
        const hour = new Date().getHours();
        if (hour < 12) {
            setTimeContext({ greeting: 'Good Morning', icon: Sun, gradient: 'from-amber-400 to-orange-500', text: 'text-amber-600' });
        } else if (hour < 18) {
            setTimeContext({ greeting: 'Good Afternoon', icon: CloudSun, gradient: 'from-sky-400 to-blue-500', text: 'text-sky-600' });
        } else {
            setTimeContext({ greeting: 'Good Evening', icon: Moon, gradient: 'from-indigo-600 to-purple-800', text: 'text-indigo-400' });
        }
    }, []);

    // Location & Weather Twist
    const enableLocation = () => {
        setLocationState('loading');
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    try {
                        // Fetch weather from Open-Meteo & Location from BigDataCloud (No API Keys required)
                        const [weatherRes, geoRes] = await Promise.all([
                            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`),
                            fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
                        ]);
                        
                        const weatherData = await weatherRes.json();
                        const geoData = await geoRes.json();
                        
                        
                        const newWeatherData = {
                            temp: Math.round(weatherData.current_weather.temperature),
                            code: weatherData.current_weather.weathercode,
                            isDay: weatherData.current_weather.is_day,
                            locationName: geoData.city || geoData.locality || geoData.principalSubdivision || 'Local Area',
                            latitude: lat,
                            longitude: lon
                        };
                        setWeatherData(newWeatherData);
                        setLocationState('granted');
                        localStorage.setItem('weatherData', JSON.stringify(newWeatherData));
                        localStorage.setItem('locationState', 'granted');
                    } catch (e) {
                        setLocationState('granted'); // Granted but fetch failed
                        localStorage.setItem('locationState', 'granted');
                    }
                },
                () => {
                    setLocationState('denied');
                    localStorage.setItem('locationState', 'denied');
                }
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24 selection:bg-blue-600 selection:text-white">
            <main className="p-5 max-w-lg mx-auto space-y-6 pt-6">
                
                {/* Header: Greeting & Avatar */}
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Hello, {user?.first_name || 'Resident'}! 👋</h2>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">Welcome to BarangayLink</p>
                    </div>
                    <button 
                        onClick={() => navigate('/resident/notifications')}
                        className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-white shadow-sm overflow-hidden shrink-0 transition-transform active:scale-95"
                    >
                        <Bell size={20} />
                    </button>
                </div>

                {/* Location Prompt Banner */}
                {locationState === 'prompt' && (
                    <Card className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-[0_8px_30px_rgb(37,99,235,0.2)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Enable Location</h4>
                                <p className="text-[11px] font-medium text-blue-100 opacity-90">For nearby services & better reporting</p>
                            </div>
                        </div>
                        <button onClick={enableLocation} className="px-3 py-1.5 bg-white text-blue-600 font-bold text-xs rounded-full hover:scale-105 transition-transform active:scale-95">
                            Allow
                        </button>
                    </Card>
                )}
                {locationState === 'loading' && (
                    <Card className="p-4 bg-blue-50 text-blue-600 flex items-center justify-center border-dashed">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-wider">Locating you...</span>
                        </div>
                    </Card>
                )}
                {locationState === 'granted' && weatherData && (
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <MapPin size={12} className="text-blue-500" />
                        {weatherData.locationName} • {weatherData.temp}°C
                    </div>
                )}

                {/* Announcements Banner */}
                <section>
                    <SectionHeader title="Announcements" className="mb-3" action={<button onClick={() => navigate('/resident/notifications')} className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Tap to view all</button>} />
                    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x hide-scrollbar -mx-5 px-5">
                        {loadingData ? (
                            <Card className="min-w-[280px] p-5 snap-start">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                            </Card>
                        ) : announcements.length === 0 ? (
                            <Card className="w-full p-6 bg-slate-50 border-dashed text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No new announcements</p>
                            </Card>
                        ) : (
                            announcements.map((ann) => (
                                <Card key={ann.id} className="min-w-[300px] p-5 snap-start relative overflow-hidden bg-gradient-to-br from-blue-50 to-white border-blue-100" onClick={() => navigate('/resident/notifications')}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 pr-6">{ann.title}</h4>
                                        <div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 opacity-50">
                                            <Bell size={14} />
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-600 line-clamp-2 leading-relaxed mb-3">{ann.content}</p>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600">
                                        <span>View Details</span>
                                        <ChevronRight size={12} />
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </section>

                {/* Quick Actions (4 icon grid) */}
                <section>
                    <SectionHeader title="Quick Actions" className="mb-3" />
                    <div className="grid grid-cols-4 gap-3">
                        <button onClick={() => navigate('/resident/reports')} className="flex flex-col items-center gap-2 group active:scale-95 transition-transform">
                            <div className="w-[60px] h-[60px] rounded-[18px] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                                <AlertTriangle size={24} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-semibold text-center text-slate-600 leading-tight">Report an<br/>Issue</span>
                        </button>
                        <button onClick={() => navigate('/resident/services')} className="flex flex-col items-center gap-2 group active:scale-95 transition-transform">
                            <div className="w-[60px] h-[60px] rounded-[18px] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                                <FileText size={24} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-semibold text-center text-slate-600 leading-tight">Request<br/>Document</span>
                        </button>
                        <button onClick={() => navigate('/resident/sos')} className="flex flex-col items-center gap-2 group active:scale-95 transition-transform">
                            <div className="w-[60px] h-[60px] rounded-[18px] bg-red-50 border border-red-100 shadow-sm flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors relative">
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                <HeartPulse size={24} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-semibold text-center text-red-600 leading-tight">Emergency<br/>SOS</span>
                        </button>
                        <button onClick={() => navigate('/resident/services')} className="flex flex-col items-center gap-2 group active:scale-95 transition-transform">
                            <div className="w-[60px] h-[60px] rounded-[18px] bg-rose-50 border border-rose-100 shadow-sm flex items-center justify-center text-rose-500 group-hover:bg-rose-100 transition-colors">
                                <Pill size={24} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-semibold text-center text-rose-600 leading-tight">Request<br/>Medicine</span>
                        </button>
                    </div>
                </section>

                {/* Nearby Services */}
                <section>
                    <SectionHeader title="Nearby Services" className="mb-3" action={<button onClick={() => navigate('/resident/map')} className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">View All</button>} />
                    <div className="space-y-3">
                        <Card onClick={() => navigate('/resident/map')} className="p-4 flex items-center gap-4 hover:border-blue-100 cursor-pointer transition-colors active:scale-[0.98]">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <Briefcase size={20} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-slate-900">Health Center</h4>
                                <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={10} /> 0.5 km away</p>
                            </div>
                            <ChevronRight size={16} className="text-slate-400" />
                        </Card>
                        <Card onClick={() => navigate('/resident/map')} className="p-4 flex items-center gap-4 hover:border-blue-100 cursor-pointer transition-colors active:scale-[0.98]">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <Building size={20} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-slate-900">Barangay Hall</h4>
                                <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={10} /> 0.8 km away</p>
                            </div>
                            <ChevronRight size={16} className="text-slate-400" />
                        </Card>
                    </div>
                </section>

                {/* Activity Timeline */}
                <section>
                    <SectionHeader title="Recent Activity" className="mb-4 mt-6" />
                    <div className="space-y-4">
                        {loadingData ? (
                            [1, 2].map(i => (
                                <div key={i} className="flex gap-4 animate-pulse">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full shrink-0"></div>
                                    <div className="flex-1 py-1">
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                </div>
                            ))
                        ) : recentActivity.length === 0 ? (
                            <div className="text-center py-6 text-sm font-semibold text-slate-500">No recent activity.</div>
                        ) : (
                            recentActivity.map((act, i) => (
                                <Card key={i} className="p-4 flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                        <act.icon size={18} className={act.color} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-[13px] text-slate-900 line-clamp-1 pr-2">{act.title}</h4>
                                            <span className="text-[9px] font-bold text-slate-400 shrink-0">{new Date(act.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[11px] font-medium text-slate-500">{act.type}</span>
                                            <StatusBadge status={act.status} />
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {/* Floating AI Assistant Button */}
            <button 
                onClick={() => navigate('/resident/emergency')} 
                className="fixed bottom-[110px] right-6 z-40 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_10px_40px_rgba(79,70,229,0.4)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all border-[3px] border-white"
            >
                <Sparkles size={28} className="animate-pulse" strokeWidth={2} />
            </button>
        </div>
    );
}
