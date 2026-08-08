import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { CheckCircle2, ChevronRight, AlertTriangle, ShieldAlert, Car, Trash2, Flame } from 'lucide-react';

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('reports'); // 'reports', 'history'
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [repRes, catRes] = await Promise.all([
            api.get('/reports'),
            api.get('/categories')
        ]);
        setReports(repRes.data);
        setCategories(catRes.data.reports || []);
    };

    const handleOneClickReport = async (categoryId, categoryName) => {
        if (!confirm(`Report a ${categoryName} at your current location?`)) return;
        
        setLoadingId(categoryId);
        
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            setLoadingId(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const data = {
                        category_id: categoryId,
                        title: `Mobile Report: ${categoryName}`,
                        description: '1-Click report submitted from mobile app.',
                        address: 'Location pinned via GPS',
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    await api.post('/reports', data);
                    await loadData();
                    setActiveTab('history');
                    alert('Report submitted successfully! Responders have been notified.');
                } catch (err) {
                    alert('Failed to submit report');
                } finally {
                    setLoadingId(null);
                }
            },
            () => {
                alert('Could not get your location. Please enable location services to use 1-click reporting.');
                setLoadingId(null);
            },
            { enableHighAccuracy: true }
        );
    };

    // Helper to map generic categories to nice icons and colors
    const getReportIcon = (name) => {
        const n = name.toLowerCase();
        if (n.includes('crime') || n.includes('security')) return { icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50', hover: 'hover:border-red-200 hover:shadow-[0_8px_30px_rgb(220,38,38,0.15)]' };
        if (n.includes('traffic') || n.includes('road')) return { icon: Car, color: 'text-amber-600', bg: 'bg-amber-50', hover: 'hover:border-amber-200 hover:shadow-[0_8px_30px_rgb(217,119,6,0.15)]' };
        if (n.includes('waste') || n.includes('garbage')) return { icon: Trash2, color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'hover:border-emerald-200 hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)]' };
        if (n.includes('fire')) return { icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50', hover: 'hover:border-orange-200 hover:shadow-[0_8px_30px_rgb(234,88,12,0.15)]' };
        return { icon: AlertTriangle, color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(37,99,235,0.15)]' };
    };

    return (
        <div className="max-w-lg mx-auto p-6 min-h-screen pb-32">
            <h2 className="text-3xl font-black text-text-primary tracking-tight mb-6">Reports</h2>

            {/* Flat Toggle Tabs */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
                <button 
                    onClick={() => setActiveTab('reports')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'reports' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
                    1-Click Reports
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'history' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
                    My History
                </button>
            </div>

            {activeTab === 'reports' ? (
                <div>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 ml-2">What do you want to report?</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {categories.map(cat => {
                            const style = getReportIcon(cat.name);
                            const Icon = style.icon;
                            const isProcessing = loadingId === cat.id;
                            
                            return (
                                <button 
                                    key={cat.id} 
                                    disabled={isProcessing}
                                    onClick={() => handleOneClickReport(cat.id, cat.name)}
                                    className={`card bg-white/80 backdrop-blur-md p-5 border border-white/50 ${style.hover} flex flex-col items-center justify-center text-center gap-3 transition-all active:scale-[0.98] ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}
                                >
                                    <div className={`h-14 w-14 rounded-[1.25rem] flex items-center justify-center ${style.bg} shrink-0`}>
                                        {isProcessing ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current text-gray-500"></div>
                                        ) : (
                                            <Icon size={28} className={style.color} strokeWidth={2.2} />
                                        )}
                                    </div>
                                    <span className="font-bold text-[13px] text-text-primary leading-tight">{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                        <p className="text-xs text-blue-800 font-semibold">
                            Tapping a category will securely submit a report with your current GPS location to the barangay dispatch center immediately.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.length === 0 ? (
                        <div className="text-center p-12 text-text-muted font-medium text-sm bg-white rounded-2xl border border-dashed border-gray-300">
                            No reports found.
                        </div>
                    ) : (
                        reports.map(r => (
                            <div key={r.id} className="card bg-white p-5 hover:shadow-md transition-all border-border/50">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <h3 className="font-bold text-base text-text-primary">{r.category?.name || 'Report'}</h3>
                                    </div>
                                    <span className={`badge border-none font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 ${r.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : (r.status === 'IN PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')}`}>
                                        {r.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Reported on {new Date(r.created_at).toLocaleDateString()}</span>
                                    <span className="text-[11px] font-bold text-primary flex items-center gap-1">Details <ChevronRight size={12} /></span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
