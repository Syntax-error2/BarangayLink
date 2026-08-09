import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../../lib/axios';
import { 
    FileText, Briefcase, Users, Bell, TrendingUp, AlertTriangle,
    CheckCircle2, Plus, ArrowRight, Megaphone, Calendar, UserPlus,
    Activity, Clock, MapPin, Search
} from 'lucide-react';
import { 
    AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, 
    CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ 
        total_reports: 0, 
        pending_requests_count: 0, 
        total_residents: 0, 
        active_announcements: 0,
        active_emergencies: 0,
        chart_data: [],
        reports_by_category: [],
        reports_by_status: [],
        top_areas: [],
        recent_activity: [],
        pending_service_requests: [],
        upcoming_events: [],
        system_alerts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard')
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];
    const STATUS_COLORS = {
        'SUBMITTED': '#94a3b8',
        'RECEIVED': '#3b82f6',
        'VERIFIED': '#8b5cf6',
        'ASSIGNED': '#f59e0b',
        'IN PROGRESS': '#0ea5e9',
        'RESOLVED': '#10b981',
        'CLOSED': '#10b981'
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <p className="text-slate-500 font-medium text-sm animate-pulse">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    const maxAreaReports = Math.max(...(stats.top_areas.length ? stats.top_areas.map(a => a.total) : [1]));

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            
            {/* System Alerts Banner (If Any Critical) */}
            {stats.active_emergencies > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-4 shadow-sm animate-fade-in">
                    <div className="bg-red-500 text-white p-2 rounded-xl shrink-0">
                        <AlertTriangle size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 pt-0.5">
                        <h3 className="text-red-800 font-bold text-sm">Critical Alert: Active Emergencies</h3>
                        <p className="text-red-600 text-sm mt-0.5">There are currently {stats.active_emergencies} active emergencies that require immediate attention.</p>
                    </div>
                    <Link to="/admin/emergencies" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">
                        View Emergencies
                    </Link>
                </div>
            )}

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { title: 'Total Reports', value: stats.total_reports, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12% from last month' },
                    { title: 'Pending Requests', value: stats.pending_requests_count, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Requires attention', alert: stats.pending_requests_count > 0 },
                    { title: 'Total Residents', value: stats.total_residents, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5 new this week' },
                    { title: 'Active Announcements', value: stats.active_announcements, icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'View active broadcasts' },
                ].map((card, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                        {card.alert && (
                            <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                            </span>
                        )}
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 ${card.bg} ${card.color} rounded-xl`}>
                                <card.icon size={22} strokeWidth={2.5} />
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-semibold mb-1">{card.title}</h3>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">{card.value}</p>
                        </div>
                        <p className="text-[11px] font-medium text-slate-400 mt-3 pt-3 border-t border-slate-50 flex items-center gap-1">
                            {card.title === 'Pending Requests' && card.value > 0 ? (
                                <span className="text-amber-600 flex items-center gap-1"><AlertTriangle size={12}/> {card.trend}</span>
                            ) : (
                                <span className="text-emerald-500 flex items-center gap-1"><TrendingUp size={12}/> {card.trend}</span>
                            )}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Reports Overview Line Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-base font-bold text-slate-900">Reports Overview</h3>
                                <select className="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-2 py-1 outline-none">
                                    <option>Last 7 Days</option>
                                    <option>This Month</option>
                                </select>
                            </div>
                            <div className="h-60">
                                {stats.chart_data && stats.chart_data.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                            <RechartsTooltip 
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }}
                                                itemStyle={{ fontWeight: 'bold' }}
                                            />
                                            <Area type="monotone" dataKey="new_reports" name="New Reports" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" />
                                            <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">No activity data available.</div>
                                )}
                            </div>
                        </div>

                        {/* Reports by Category Donut Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                            <h3 className="text-base font-bold text-slate-900 mb-2">Reports by Category</h3>
                            <div className="flex-1 relative">
                                {stats.reports_by_category && stats.reports_by_category.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.reports_by_category}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {stats.reports_by_category.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip 
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }}
                                                itemStyle={{ fontWeight: 'bold' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">No category data available.</div>
                                )}
                                {/* Center Total */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-black text-slate-900 leading-none">
                                        {stats.reports_by_category.reduce((sum, item) => sum + item.value, 0)}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Total</span>
                                </div>
                            </div>
                            {/* Legend */}
                            <div className="mt-4 grid grid-cols-2 gap-2 px-2">
                                {stats.reports_by_category.slice(0, 4).map((category, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                        <span className="text-xs text-slate-600 truncate">{category.name}</span>
                                        <span className="text-xs font-bold text-slate-900 ml-auto">{category.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Split Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Recent Reports List */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-base font-bold text-slate-900">Recent Reports</h3>
                                <Link to="/admin/reports" className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
                                    View All <ArrowRight size={12} />
                                </Link>
                            </div>
                            
                            <div className="space-y-4 flex-1">
                                {stats.recent_activity.length > 0 ? (
                                    stats.recent_activity.map(report => (
                                        <div key={report.id} className="flex gap-3 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                                {report.user?.profile_photo_path ? (
                                                    <img src={getImageUrl(report.user.profile_photo_path)} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserPlus size={16} className="text-slate-400" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-slate-900 truncate">{report.title}</p>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                                    {report.user?.first_name} {report.user?.last_name} • {new Date(report.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="px-2 py-1 rounded text-[10px] font-bold text-white shrink-0 uppercase" style={{ backgroundColor: STATUS_COLORS[report.status] || STATUS_COLORS['SUBMITTED'] }}>
                                                {report.status}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">No recent reports.</div>
                                )}
                            </div>
                        </div>

                        {/* Top Areas */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-base font-bold text-slate-900 mb-5">Top Areas (Most Reports)</h3>
                            <div className="space-y-5">
                                {stats.top_areas.length > 0 ? (
                                    stats.top_areas.map((area, idx) => (
                                        <div key={idx}>
                                            <div className="flex justify-between text-xs font-semibold mb-1.5">
                                                <span className="text-slate-700 truncate max-w-[70%]">{area.address || 'Unknown Area'}</span>
                                                <span className="text-slate-900">{area.total} reports</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full" 
                                                    style={{ width: `${(area.total / maxAreaReports) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-slate-400 text-sm mt-8">No area data available.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (1/3 width) */}
                <div className="space-y-6">
                    
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/admin/announcements" className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors text-center group">
                                <Megaphone size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">New Broadcast</span>
                            </Link>
                            <Link to="/admin/reports" className="flex flex-col items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors text-center group">
                                <FileText size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">View Reports</span>
                            </Link>
                            <Link to="/admin/events" className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors text-center group">
                                <Calendar size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">Add Event</span>
                            </Link>
                            <Link to="/admin/residents" className="flex flex-col items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors text-center group">
                                <UserPlus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">Add Resident</span>
                            </Link>
                        </div>
                    </div>

                    {/* System Alerts */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-slate-900">System Alerts</h3>
                        </div>
                        <div className="space-y-3">
                            {stats.system_alerts && stats.system_alerts.length > 0 ? (
                                stats.system_alerts.map((alert, idx) => (
                                    <div key={idx} className={`p-3 rounded-xl border flex items-start gap-3 
                                        ${alert.type === 'critical' ? 'bg-red-50 border-red-100 text-red-800' : 
                                          alert.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' : 
                                          'bg-blue-50 border-blue-100 text-blue-800'}`}
                                    >
                                        <div className="mt-0.5">
                                            {alert.type === 'critical' ? <AlertTriangle size={16} /> : <Bell size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold leading-tight">{alert.title}</p>
                                            {alert.description && <p className="text-xs mt-1 opacity-80">{alert.description}</p>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                                    <p className="text-sm font-semibold text-slate-700">All Systems Normal</p>
                                    <p className="text-xs text-slate-500 mt-1">No active system alerts.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-slate-900">Upcoming Events</h3>
                        </div>
                        <div className="space-y-4">
                            {stats.upcoming_events && stats.upcoming_events.length > 0 ? (
                                stats.upcoming_events.map((evt, idx) => {
                                    const date = new Date(evt.start_date);
                                    return (
                                        <div key={idx} className="flex gap-4 items-center group">
                                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 min-w-[50px] text-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase">{date.toLocaleString('default', { month: 'short' })}</p>
                                                <p className="text-lg font-black text-blue-600 leading-none mt-0.5">{date.getDate()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{evt.title}</p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                    <Clock size={12} /> {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    {evt.location && <><MapPin size={12} className="ml-2" /> {evt.location}</>}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="text-center p-4 text-slate-400">
                                    <Calendar size={24} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm font-medium">No upcoming events</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
