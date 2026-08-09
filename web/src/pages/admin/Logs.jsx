import React, { useState, useEffect } from 'react';
import { Search, Activity, User, Monitor, Clock } from 'lucide-react';
import api from '../../lib/axios';

export default function AdminLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLogs();
    }, [searchTerm]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/audit-logs', {
                params: { search: searchTerm }
            });
            setLogs(res.data.data || res.data);
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
                    <p className="text-slate-500">Monitor system activity and administrator actions</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search logs..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-500">Loading audit logs...</div>
                ) : logs.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity size={32} />
                        </div>
                        <h3 className="font-semibold text-slate-900">No logs found</h3>
                        <p className="text-slate-500 text-sm mt-1">There is no system activity matching your criteria</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="p-4 pl-6 font-medium">Action & Module</th>
                                <th className="p-4 font-medium">Description</th>
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">IP Address</th>
                                <th className="p-4 font-medium">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="font-semibold text-slate-900 capitalize">{log.action || 'Updated'}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">{log.module || 'System'}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 max-w-sm truncate" title={log.description}>
                                        {log.description || 'Performed a system action'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                                                <User size={12} />
                                            </div>
                                            <span className="font-medium text-slate-700">
                                                {log.user ? `${log.user.first_name} ${log.user.last_name}` : 'System User'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono bg-slate-50 px-2 py-1 rounded inline-flex">
                                            <Monitor size={12} />
                                            {log.ip_address || '127.0.0.1'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500 text-xs whitespace-nowrap flex items-center gap-1.5">
                                        <Clock size={14} />
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
