import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Briefcase, CheckCircle2, ChevronRight, FileText, ClipboardList, Shield, Home, Building, X, Send } from 'lucide-react';
import Header from '../../components/layout/Header';

export default function Services() {
    const [requests, setRequests] = useState([]);
    const [types, setTypes] = useState([]);
    const [activeTab, setActiveTab] = useState('services'); // 'services', 'history'
    const [loading, setLoading] = useState(false);
    const [requestModal, setRequestModal] = useState({ isOpen: false, service: null, purpose: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [reqRes, catRes] = await Promise.all([
            api.get('/service-requests'),
            api.get('/categories')
        ]);
        setRequests(reqRes.data);
        setTypes(catRes.data.services || []);
    };

    const submitRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/service-requests', { 
                service_type_id: requestModal.service.id, 
                remarks: requestModal.purpose || 'For records and reference'
            });
            await loadData();
            setRequestModal({ isOpen: false, service: null, purpose: '' });
            setActiveTab('history');
        } catch (err) {
            alert('Failed to request service');
        } finally {
            setLoading(false);
        }
    };

    const getServiceIcon = (name) => {
        const n = name.toLowerCase();
        if (n.includes('clearance')) return { icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50', hover: 'hover:border-indigo-200 hover:shadow-[0_8px_30px_rgb(79,70,229,0.15)]' };
        if (n.includes('indigency')) return { icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'hover:border-emerald-200 hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)]' };
        if (n.includes('business')) return { icon: Building, color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(37,99,235,0.15)]' };
        if (n.includes('certificate')) return { icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', hover: 'hover:border-amber-200 hover:shadow-[0_8px_30px_rgb(245,158,11,0.15)]' };
        return { icon: ClipboardList, color: 'text-slate-600', bg: 'bg-slate-50', hover: 'hover:border-slate-200 hover:shadow-[0_8px_30px_rgb(100,116,139,0.15)]' };
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-32 relative">
            <Header title="Services" />
            
            <div className="max-w-lg mx-auto p-5">

            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
                <button 
                    onClick={() => setActiveTab('services')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'services' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                    Available Services
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                    My Requests
                </button>
            </div>

            {activeTab === 'services' ? (
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 ml-2">Request a Document</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {types.map(type => {
                            const style = getServiceIcon(type.name);
                            const Icon = style.icon;
                            
                            return (
                                <button 
                                    key={type.id} 
                                    onClick={() => setRequestModal({ isOpen: true, service: type, purpose: '' })}
                                    className={`bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${style.hover} flex flex-col items-center justify-center text-center gap-3 transition-all active:scale-[0.98]`}
                                >
                                    <div className={`h-14 w-14 rounded-[1.25rem] flex items-center justify-center ${style.bg} shrink-0`}>
                                        <Icon size={28} className={style.color} strokeWidth={2.2} />
                                    </div>
                                    <span className="font-bold text-[13px] text-slate-900 leading-tight">{type.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.length === 0 ? (
                        <div className="text-center p-12 text-slate-500 font-medium text-sm bg-white rounded-3xl border border-dashed border-slate-300">
                            No requests found.
                        </div>
                    ) : (
                        requests.map(r => (
                            <div key={r.id} className="bg-white rounded-3xl p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            <FileText size={18} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900">{r.service_type?.name}</h3>
                                            <p className="text-xs text-slate-500 mt-0.5 font-medium truncate max-w-[150px]">{r.remarks || 'No purpose stated'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                                    <span className={`inline-flex font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full ${r.status === 'RELEASED' || r.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                        {r.status}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-400">{new Date(r.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Request Modal */}
            {requestModal.isOpen && requestModal.service && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setRequestModal({ isOpen: false, service: null, purpose: '' })}></div>
                    <div className="relative bg-white w-full max-w-lg mx-auto rounded-t-[2.5rem] shadow-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-full duration-300 ease-out">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Request Service</h3>
                                <p className="text-slate-500 font-medium text-sm mt-1">{requestModal.service.name}</p>
                            </div>
                            <button onClick={() => setRequestModal({ isOpen: false, service: null, purpose: '' })} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={submitRequest} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Purpose of Request</label>
                                <textarea 
                                    required 
                                    autoFocus
                                    value={requestModal.purpose} 
                                    onChange={(e) => setRequestModal({ ...requestModal, purpose: e.target.value })}
                                    placeholder="e.g., For local employment, scholarship application, etc."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 min-h-[120px] resize-y font-medium text-slate-900"
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading || !requestModal.purpose.trim()}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <><Send size={18} /> Submit Request</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
