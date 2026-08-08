import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { FileText, AlertTriangle, Briefcase, CheckCircle2, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ 
        total_reports: 0, 
        pending_requests: 0, 
        active_emergencies: 0, 
        resolved_reports: 0,
        chart_data: [],
        recent_activity: []
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

    const cards = [
        { title: 'Total Reports', value: stats.total_reports, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { title: 'Active Emergencies', value: stats.active_emergencies, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', alert: stats.active_emergencies > 0 },
        { title: 'Pending Services', value: stats.pending_requests, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        { title: 'Resolved Reports', value: stats.resolved_reports, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className={`bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border ${card.border} relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300`}>
                        {card.alert && (
                            <div className="absolute top-0 right-0 w-2 h-2 m-4 rounded-full bg-red-500 animate-ping"></div>
                        )}
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{card.title}</h3>
                                <p className={`text-4xl font-black ${card.color} tracking-tight`}>{card.value}</p>
                            </div>
                            <div className={`p-4 ${card.bg} rounded-2xl ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                                <card.icon size={28} strokeWidth={2.5} />
                            </div>
                        </div>
                        {/* Decorative background blob */}
                        <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${card.bg} rounded-full mix-blend-multiply filter blur-2xl opacity-50`}></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Report Activity</h3>
                            <p className="text-sm text-slate-500 font-medium">Number of reports filed over the last 7 days</p>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        {stats.chart_data && stats.chart_data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#0f172a' }}
                                    />
                                    <Area type="monotone" dataKey="reports" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 font-medium text-sm">
                                No activity data available for the past week.
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Reports</h3>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {stats.recent_activity && stats.recent_activity.length > 0 ? (
                            stats.recent_activity.map(report => (
                                <div key={report.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-colors cursor-pointer group">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FileText size={18} strokeWidth={2.5} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-slate-900 truncate">
                                            {report.title}
                                        </p>
                                        <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">
                                            {report.user?.first_name} {report.user?.last_name} • {new Date(report.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                                            ${report.status === 'SUBMITTED' ? 'bg-slate-200 text-slate-700' : 
                                              report.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 
                                              report.status === 'IN PROGRESS' ? 'bg-blue-100 text-blue-700' : 
                                              'bg-amber-100 text-amber-700'}`}
                                        >
                                            {report.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                    <FileText size={24} className="text-slate-300" />
                                </div>
                                <p className="text-sm font-medium">No recent reports.</p>
                                <p className="text-xs mt-1">When residents submit reports, they will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
