import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Search, Filter, Eye, MapPin, Calendar, User, FileText, ChevronDown, Check, X } from 'lucide-react';

export default function AdminReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await api.get('/reports');
            setReports(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/reports/${id}/status`, { status: newStatus });
            setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
            if (selectedReport && selectedReport.id === id) {
                setSelectedReport({ ...selectedReport, status: newStatus });
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const getStatusStyles = (status) => {
        switch(status) {
            case 'RESOLVED':
            case 'CLOSED':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'IN PROGRESS':
            case 'ASSIGNED':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'SUBMITTED':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const filteredReports = reports.filter(r => 
        r.title.toLowerCase().includes(search.toLowerCase()) || 
        r.category?.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search reports..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-[0.98] w-full sm:w-auto">
                        <Filter size={18} /> Filter
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Report Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Resident</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </td>
                                </tr>
                            ) : filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium text-sm">
                                        No reports found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map(r => (
                                    <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{r.title}</span>
                                                <span className="text-xs font-medium text-slate-500 mt-0.5">{new Date(r.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                                    {r.user?.first_name?.[0]}{r.user?.last_name?.[0]}
                                                </div>
                                                <span className="font-semibold text-slate-700 text-sm">{r.user?.first_name} {r.user?.last_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">
                                                {r.category?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <select 
                                                    className={`appearance-none font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 pr-8 rounded-full border outline-none cursor-pointer transition-all ${getStatusStyles(r.status)}`}
                                                    value={r.status}
                                                    onChange={(e) => updateStatus(r.id, e.target.value)}
                                                >
                                                    {['SUBMITTED', 'VERIFIED', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED'].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setSelectedReport(r)}
                                                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                <Eye size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedReport(null)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="text-blue-600" />
                                Report Details
                            </h3>
                            <button onClick={() => setSelectedReport(null)} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="mb-6">
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{selectedReport.title}</h4>
                                <div className="flex flex-wrap gap-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyles(selectedReport.status)}`}>
                                        {selectedReport.status}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                        {selectedReport.category?.name}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <h5 className="text-sm font-bold text-slate-900 mb-2">Description</h5>
                                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedReport.description}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0"><User size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Reporter</p>
                                            <p className="font-semibold text-slate-900 text-sm mt-0.5">{selectedReport.user?.first_name} {selectedReport.user?.last_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0"><Calendar size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Date Filed</p>
                                            <p className="font-semibold text-slate-900 text-sm mt-0.5">{new Date(selectedReport.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><MapPin size={20} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Location</p>
                                        <p className="font-semibold text-slate-900 text-sm mt-0.5">{selectedReport.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
                            <button 
                                onClick={() => setSelectedReport(null)}
                                className="px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all"
                            >
                                Close
                            </button>
                            <button 
                                onClick={() => {
                                    updateStatus(selectedReport.id, 'RESOLVED');
                                    setSelectedReport(null);
                                }}
                                className="px-5 py-2.5 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.2)]"
                            >
                                <Check size={18} /> Mark as Resolved
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
