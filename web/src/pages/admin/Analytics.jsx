import { useState } from 'react';
import { 
    BarChart2, TrendingUp, Users, Activity,
    Download, Calendar as CalendarIcon, PieChart as PieChartIcon
} from 'lucide-react';
import { 
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function Analytics() {
    const [timeRange, setTimeRange] = useState('This Month');

    const resolutionData = [
        { name: 'Jan', resolved: 45, pending: 12 },
        { name: 'Feb', resolved: 52, pending: 8 },
        { name: 'Mar', resolved: 38, pending: 15 },
        { name: 'Apr', resolved: 65, pending: 5 },
        { name: 'May', resolved: 48, pending: 10 },
        { name: 'Jun', resolved: 59, pending: 7 },
    ];

    const demographicsData = [
        { name: '18-25', value: 15 },
        { name: '26-35', value: 30 },
        { name: '36-50', value: 25 },
        { name: '51-65', value: 20 },
        { name: '65+', value: 10 },
    ];

    const serviceData = [
        { name: 'Clearance', requests: 120 },
        { name: 'Medicine', requests: 85 },
        { name: 'Indigency', requests: 65 },
        { name: 'Business', requests: 40 },
        { name: 'Residency', requests: 30 },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h1>
                    <p className="text-sm text-slate-500 mt-1">Detailed metrics and performance data.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-48">
                        <select 
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="w-full bg-white border border-slate-200 text-sm font-medium rounded-xl py-2 pl-4 pr-10 appearance-none focus:outline-none focus:border-blue-500 shadow-sm"
                        >
                            <option>Today</option>
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                        <CalendarIcon size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors shadow-sm shrink-0">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { title: 'Total Active Users', value: '1,248', trend: '+12%', isUp: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { title: 'Avg. Resolution Time', value: '4.2 hrs', trend: '-15%', isUp: true, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { title: 'Service Requests', value: '340', trend: '+5%', isUp: true, icon: BarChart2, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { title: 'Resident Satisfaction', value: '94%', trend: '-2%', isUp: false, icon: PieChartIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                                <kpi.icon size={20} strokeWidth={2.5} />
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-bold ${kpi.isUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-full`}>
                                <TrendingUp size={12} className={!kpi.isUp ? 'rotate-180' : ''} />
                                {kpi.trend}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">{kpi.title}</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{kpi.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Resolution Trends */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 mb-6">Issue Resolution Trends</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={resolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                <Area type="monotone" dataKey="resolved" name="Resolved Issues" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRes)" />
                                <Area type="monotone" dataKey="pending" name="Pending Issues" stroke="#f59e0b" strokeWidth={3} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Popular Services */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 mb-6">Top Service Requests</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={serviceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} width={80} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                                <Bar dataKey="requests" name="Total Requests" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Age Demographics */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 mb-6">Resident Age Demographics</h3>
                    <div className="h-72 w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={demographicsData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {demographicsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} formatter={(value) => `${value}%`} />
                                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-[100px]">
                            <span className="text-2xl font-black text-slate-900 leading-none">100%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Total</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
