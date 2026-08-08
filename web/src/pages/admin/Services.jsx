import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Search, Filter, Eye, Briefcase, Calendar, User, FileText, ChevronDown, Check, X, Printer, Edit3 } from 'lucide-react';
import PrintableDocument from '../../components/PrintableDocument';

export default function AdminServices() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDocPreview, setShowDocPreview] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/service-requests');
            setRequests(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/service-requests/${id}`, { status: newStatus });
            setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
            if (selectedRequest && selectedRequest.id === id) {
                setSelectedRequest({ ...selectedRequest, status: newStatus });
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const getStatusStyles = (status) => {
        switch(status) {
            case 'COMPLETED':
            case 'APPROVED':
            case 'READY':
            case 'RELEASED':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'IN PROGRESS':
            case 'PROCESSING':
            case 'UNDER REVIEW':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'PENDING':
            case 'SUBMITTED':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'REJECTED':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const filteredRequests = requests.filter(r => 
        r.service_type?.name?.toLowerCase().includes(search.toLowerCase()) || 
        r.user?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.user?.last_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 print:hidden">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search service requests..." 
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
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden print:hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Resident</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Requested</th>
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
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium text-sm">
                                        No service requests found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map(r => (
                                    <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                    <Briefcase size={18} strokeWidth={2.5} />
                                                </div>
                                                <span className="font-bold text-slate-900">{r.service_type?.name}</span>
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
                                            <span className="text-sm font-medium text-slate-600">{new Date(r.created_at).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative inline-block">
                                                <select 
                                                    className={`appearance-none font-bold text-[11px] uppercase tracking-wider pl-3 pr-8 py-1.5 rounded-full border shadow-sm outline-none cursor-pointer transition-all hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${getStatusStyles(r.status)}`}
                                                    value={r.status}
                                                    onChange={(e) => updateStatus(r.id, e.target.value)}
                                                >
                                                    {['SUBMITTED', 'UNDER REVIEW', 'PROCESSING', 'READY', 'COMPLETED', 'RELEASED', 'REJECTED'].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => { setSelectedRequest(r); setShowDocPreview(false); }}
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
            {selectedRequest && !showDocPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:hidden">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Briefcase className="text-indigo-600" />
                                Service Request Details
                            </h3>
                            <button onClick={() => setSelectedRequest(null)} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="mb-6">
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{selectedRequest.service_type?.name}</h4>
                                <div className="flex flex-wrap gap-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyles(selectedRequest.status)}`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0"><User size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Requested By</p>
                                            <p className="font-semibold text-slate-900 text-sm mt-0.5">{selectedRequest.user?.first_name} {selectedRequest.user?.last_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0"><Calendar size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Date Requested</p>
                                            <p className="font-semibold text-slate-900 text-sm mt-0.5">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <h5 className="text-sm font-bold text-slate-900 mb-2">Purpose / Notes</h5>
                                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedRequest.remarks || "No additional notes provided by the resident."}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex flex-wrap sm:flex-nowrap justify-between gap-3 shrink-0">
                            <button 
                                onClick={() => setShowDocPreview(true)}
                                className="px-5 py-2.5 rounded-2xl text-sm font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
                            >
                                <Edit3 size={18} /> Edit & Print
                            </button>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button 
                                    onClick={() => setSelectedRequest(null)}
                                    className="px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all w-full sm:w-auto"
                                >
                                    Close
                                </button>
                                <button 
                                    onClick={() => {
                                        updateStatus(selectedRequest.id, 'PROCESSING');
                                        setSelectedRequest(null);
                                    }}
                                    className="px-5 py-2.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(79,70,229,0.2)] w-full sm:w-auto justify-center"
                                >
                                    <Check size={18} /> Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Preview & Editor Mode */}
            {selectedRequest && showDocPreview && (
                <div className="fixed inset-0 z-[9999] bg-slate-900 overflow-y-auto flex flex-col print:bg-white print:block">
                    {/* Action Bar (hidden on print) */}
                    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center print:hidden shadow-sm">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setShowDocPreview(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                            <div>
                                <h3 className="font-bold text-slate-900">Document Editor Mode</h3>
                                <p className="text-xs text-slate-500">Click anywhere on the document text below to edit before printing.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => window.print()}
                            className="px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
                        >
                            <Printer size={18} /> Print Now
                        </button>
                    </div>

                    {/* The Document Wrapper */}
                    <div className="flex-1 p-8 flex justify-center items-start print:p-0">
                        <div className="bg-white shadow-2xl print:shadow-none w-[8.5in] min-h-[11in] print:w-full print:min-h-0 relative">
                            <PrintableDocument request={selectedRequest} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
