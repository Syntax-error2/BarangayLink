import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, FileText, AlertTriangle, Bell, Clock, Sun, Moon, CloudSun, CloudRain, MapPin, Thermometer, ChevronRight, Compass, Briefcase, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

export default function ResidentDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // Data States
    const [announcements, setAnnouncements] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    
    // Twist States
    const [locationState, setLocationState] = useState(sessionStorage.getItem('locationState') || 'prompt'); // 'prompt', 'loading', 'granted', 'denied'
    const [weatherData, setWeatherData] = useState(JSON.parse(sessionStorage.getItem('weatherData')) || null);
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
                            locationName: geoData.city || geoData.locality || geoData.principalSubdivision || 'Local Area'
                        };
                        setWeatherData(newWeatherData);
                        setLocationState('granted');
                        sessionStorage.setItem('weatherData', JSON.stringify(newWeatherData));
                        sessionStorage.setItem('locationState', 'granted');
                    } catch (e) {
                        setLocationState('granted'); // Granted but fetch failed
                        sessionStorage.setItem('locationState', 'granted');
                    }
                },
                () => {
                    setLocationState('denied');
                    sessionStorage.setItem('locationState', 'denied');
                }
            );
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans pb-24 selection:bg-primary selection:text-white">
            
            <div className="fixed top-16 left-0 w-full z-10 p-4 px-6 bg-white shadow-sm border-b border-border flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-text-primary tracking-tight">Dashboard</h2>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{timeContext.greeting}</p>
                </div>
            </div>

            <main className="p-6 pt-[88px] max-w-lg mx-auto space-y-6">
                {/* Clean Flat Greeting */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-text-primary tracking-tight">Hello, {user?.first_name}</h2>
                    </div>
                </div>

                {/* Flat Location Widget */}
                {locationState === 'denied' ? (
                     <div className="card bg-gray-50 border-dashed border-gray-300 p-5 flex flex-col items-center text-center gap-3">
                         <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                             <MapPin size={24} />
                         </div>
                         <div>
                             <h3 className="font-bold text-text-primary text-sm">Location Access Denied</h3>
                             <p className="text-xs text-text-secondary mt-1">Enable location permissions in your browser to unlock local insights.</p>
                         </div>
                     </div>
                ) : locationState === 'loading' ? (
                    <div className="card bg-white/70 p-6 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                        <p className="text-sm font-semibold text-primary">Locating...</p>
                    </div>
                ) : locationState === 'granted' ? (
                     <div className="card p-6 flex justify-between items-center">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-blue-50/80 backdrop-blur-sm rounded-2xl flex items-center justify-center text-blue-600">
                                 {weatherData?.temp > 28 ? <Sun size={24} /> : (weatherData?.temp > 22 ? <CloudSun size={24} /> : <CloudRain size={24} />)}
                             </div>
                             <div>
                                 <h3 className="text-2xl font-black text-text-primary">{weatherData?.temp ? `${weatherData.temp}°C` : 'Connected'}</h3>
                                 <p className="text-text-secondary font-bold text-xs uppercase tracking-widest flex items-center gap-1 mt-0.5 truncate max-w-[150px]">
                                     <MapPin size={10} className="shrink-0" /> {weatherData?.locationName || 'Local Area'}
                                 </p>
                             </div>
                         </div>
                         <div className="text-right">
                             <span className="bg-blue-50/80 backdrop-blur-sm text-blue-600 px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider">
                                 {weatherData?.temp > 28 ? 'Sunny' : 'Clear'}
                             </span>
                         </div>
                     </div>
                ) : (
                     <div className="card bg-white p-6 border-border flex flex-col items-center text-center gap-3 shadow-sm">
                         <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                             <Compass size={28} />
                         </div>
                         <div>
                             <h3 className="font-black text-text-primary text-lg">Local Insights</h3>
                             <p className="text-sm text-text-secondary mt-1 max-w-[250px] mx-auto">Allow location access for real-time weather and alerts.</p>
                         </div>
                         <button onClick={enableLocation} className="btn bg-blue-600 hover:bg-blue-700 text-white w-full max-w-[200px] py-3 rounded-xl font-bold mt-2">Enable Location</button>
                     </div>
                )}

                 {/* Flat Quick Actions */}
                 <section className="grid grid-cols-2 gap-4">
                     <button onClick={() => navigate('/resident/reports')} className="card p-5 flex flex-col items-center justify-center gap-3 bg-white hover:bg-gray-50 border-border transition-colors">
                         <div className="h-12 w-12 bg-sky-50 rounded-xl flex items-center justify-center">
                             <FileText size={24} className="text-sky-600" />
                         </div>
                         <span className="font-bold text-sm text-text-primary">Report Issue</span>
                     </button>
                     <button onClick={() => navigate('/resident/services')} className="card p-5 flex flex-col items-center justify-center gap-3 bg-white hover:bg-gray-50 border-border transition-colors">
                         <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                             <Briefcase size={24} className="text-indigo-600" />
                         </div>
                         <span className="font-bold text-sm text-text-primary">Get Service</span>
                     </button>
                 </section>

                {/* Community Board (Glassmorphic Cards) */}
                <section>
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h3 className="font-extrabold text-lg text-text-primary">Community Board</h3>
                        <span className="text-xs font-bold text-accent uppercase tracking-widest">Live Updates</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 px-1 snap-x hide-scrollbar -mx-6 px-6">
                        {loadingData ? (
                            [1, 2].map(i => (
                                <div key={i} className="card min-w-[280px] p-5 bg-white border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] snap-start">
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                </div>
                            ))
                        ) : announcements.length === 0 ? (
                            <div className="w-full card p-6 bg-gray-50/50 border-dashed text-center">
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">All caught up!</p>
                            </div>
                        ) : (
                            announcements.map((ann) => (
                                <div key={ann.id} className="card min-w-[280px] p-5 bg-white border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] snap-start group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="badge bg-accent text-white border-0 text-[10px] px-2.5 py-1 font-bold shadow-sm shadow-accent/30">{ann.type || 'Update'}</span>
                                        <span className="text-[10px] font-bold text-text-muted">{new Date(ann.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="font-extrabold text-text-primary text-base mb-1.5 line-clamp-1">{ann.title}</h4>
                                    <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">{ann.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Sleek Activity Timeline */}
                <section className="px-1">
                    <h3 className="font-extrabold text-lg text-text-primary mb-4">My History</h3>
                    <div className="space-y-5 relative">
                        {loadingData ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="flex gap-4 animate-pulse">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full shrink-0"></div>
                                    <div className="flex-1 py-1">
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                </div>
                            ))
                        ) : recentActivity.length === 0 ? (
                            <div className="text-center py-6 text-sm font-semibold text-text-muted">No recent requests found.</div>
                        ) : (
                            recentActivity.map((act, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    {/* Timeline line */}
                                    <div className="relative">
                                        {i !== recentActivity.length - 1 && <div className="absolute left-1/2 top-10 bottom-[-20px] w-0.5 bg-gray-100 -translate-x-1/2 z-0"></div>}
                                        <div className="relative z-10 p-2.5 bg-white rounded-full border border-gray-100 shadow-sm h-10 w-10 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/30 transition-all">
                                            <act.icon size={16} className={act.color} />
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 pb-1 pt-1 bg-transparent group-hover:translate-x-1 transition-transform">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h4 className="font-bold text-[15px] text-text-primary">{act.title}</h4>
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{new Date(act.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-semibold text-text-secondary">{act.type}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${act.status === 'RESOLVED' || act.status === 'COMPLETED' ? 'text-green-500' : 'text-amber-500'}`}>{act.status}</span>
                                        </div>
                                    </div>
                                </div>
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
