import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Search, Filter, Eye, AlertTriangle, Phone, MapPin, Calendar, User, ChevronDown, Check, X, ShieldAlert } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { BINALBAGAN_BOUNDS } from '../../lib/mapConstants';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function AdminEmergencies() {
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedEmergency, setSelectedEmergency] = useState(null);

    useEffect(() => {
        fetchEmergencies();
    }, []);

    const fetchEmergencies = async () => {
        try {
            const res = await api.get('/emergencies');
            setEmergencies(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/emergencies/${id}`, { status: newStatus });
            setEmergencies(emergencies.map(r => r.id === id ? { ...r, status: newStatus } : r));
            if (selectedEmergency && selectedEmergency.id === id) {
                setSelectedEmergency({ ...selectedEmergency, status: newStatus });
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const getStatusStyles = (status) => {
        switch(status) {
            case 'RESOLVED':
            case 'CLOSED':
            case 'FALSE ALARM':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'DISPATCHED':
            case 'IN PROGRESS':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'PENDING':
            case 'RECEIVED':
            case 'ACTIVE':
                return 'bg-red-50 text-red-700 border-red-200 animate-pulse';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const filteredEmergencies = emergencies.filter(r => 
        r.category?.name?.toLowerCase().includes(search.toLowerCase()) || 
        r.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.address?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-red-100">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search emergencies..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder:text-slate-400"
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex items-center justify-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-100 transition-all active:scale-[0.98] w-full sm:w-auto">
                        <Filter size={18} /> Filter Alerts
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(239,68,68,0.08)] border border-red-100 overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse mt-1">
                        <thead>
                            <tr className="bg-red-50/50 border-b border-red-100/50">
                                <th className="px-6 py-4 text-xs font-bold text-red-600 uppercase tracking-wider">Emergency Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-red-600 uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-red-600 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-xs font-bold text-red-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-red-600 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                    </td>
                                </tr>
                            ) : filteredEmergencies.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium text-sm">
                                        No active emergencies.
                                    </td>
                                </tr>
                            ) : (
                                filteredEmergencies.map(r => (
                                    <tr key={r.id} className="hover:bg-red-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                                    <AlertTriangle size={18} strokeWidth={2.5} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900">{r.category?.name || 'SOS Alert'}</span>
                                                    <span className="text-xs font-medium text-slate-500 mt-0.5">{new Date(r.created_at).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-900 text-sm">{r.contact_name || 'Unknown'}</span>
                                                <span className="text-xs font-medium text-slate-500 mt-0.5">{r.contact_phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 max-w-[200px]">
                                                <MapPin size={14} className="text-slate-400 shrink-0" />
                                                <span className="text-sm font-medium text-slate-600 truncate">{r.address}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <select 
                                                    className={`appearance-none font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 pr-8 rounded-full border outline-none cursor-pointer transition-all ${getStatusStyles(r.status)}`}
                                                    value={r.status}
                                                    onChange={(e) => updateStatus(r.id, e.target.value)}
                                                >
                                                    {['RECEIVED', 'DISPATCHED', 'IN PROGRESS', 'RESOLVED', 'FALSE ALARM'].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setSelectedEmergency(r)}
                                                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
            {selectedEmergency && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedEmergency(null)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 to-orange-500 z-10"></div>
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-red-50/30">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <ShieldAlert className="text-red-600" />
                                Emergency Dispatch Center
                            </h3>
                            <button onClick={() => setSelectedEmergency(null)} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="mb-6">
                                <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase text-red-600">{selectedEmergency.category?.name || 'SOS ALERT'}</h4>
                                <div className="flex flex-wrap gap-3">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-widest ${getStatusStyles(selectedEmergency.status)}`}>
                                        {selectedEmergency.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-red-100 shadow-sm shadow-red-500/5">
                                        <div className="p-2 bg-red-50 text-red-600 rounded-xl shrink-0"><User size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Contact Name</p>
                                            <p className="font-semibold text-slate-900 text-sm mt-0.5">{selectedEmergency.contact_name || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-red-100 shadow-sm shadow-red-500/5">
                                        <div className="p-2 bg-red-50 text-red-600 rounded-xl shrink-0"><Phone size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Contact Phone</p>
                                            <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedEmergency.contact_phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0"><Calendar size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Time Triggered</p>
                                            <p className="font-semibold text-slate-900 text-sm mt-0.5">{new Date(selectedEmergency.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><MapPin size={20} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Location</p>
                                            <p className="font-semibold text-slate-900 text-sm mt-0.5">{selectedEmergency.address}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedEmergency.latitude && selectedEmergency.longitude && (
                                    <div className="bg-slate-100 rounded-2xl h-48 border border-slate-200 overflow-hidden relative shadow-sm">
                                        <MapContainer 
                                            center={[selectedEmergency.latitude, selectedEmergency.longitude]} 
                                            zoom={15} 
                                            minZoom={13}
                                            maxBounds={BINALBAGAN_BOUNDS}
                                            maxBoundsViscosity={1.0}
                                            scrollWheelZoom={false} 
                                            className="h-full w-full z-0"
                                        >
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                                            <Marker position={[selectedEmergency.latitude, selectedEmergency.longitude]} />
                                        </MapContainer>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex flex-wrap sm:flex-nowrap justify-between gap-3 shrink-0">
                            <button 
                                onClick={() => {
                                    updateStatus(selectedEmergency.id, 'FALSE ALARM');
                                    setSelectedEmergency(null);
                                }}
                                className="px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-[0.98] transition-all flex items-center gap-2"
                            >
                                <X size={18} /> False Alarm
                            </button>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button 
                                    onClick={() => setSelectedEmergency(null)}
                                    className="px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all w-full sm:w-auto"
                                >
                                    Close
                                </button>
                                <button 
                                    onClick={() => {
                                        updateStatus(selectedEmergency.id, 'DISPATCHED');
                                        setSelectedEmergency(null);
                                    }}
                                    className="px-5 py-2.5 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(239,68,68,0.3)] w-full sm:w-auto justify-center"
                                >
                                    <ShieldAlert size={18} /> Dispatch Unit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
