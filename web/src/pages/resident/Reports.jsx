import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { CheckCircle2, ChevronRight, AlertTriangle, ShieldAlert, Car, Trash2, Flame, CloudRain, Sun, Bell, MapPin, Image as ImageIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SectionHeader from '../../components/ui/SectionHeader';
export default function Reports() {
    const [reports, setReports] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('reports'); // 'reports', 'history'
    const [loadingId, setLoadingId] = useState(null);
    const [reportModal, setReportModal] = useState({ isOpen: false, category: null });

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

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [description, setDescription] = useState('');
    
    // Auto-fill location from dashboard location permission if available
    const [locationInput, setLocationInput] = useState(() => {
        try {
            const data = JSON.parse(localStorage.getItem('weatherData'));
            return data?.locationName || '';
        } catch {
            return '';
        }
    });

    const [position, setPosition] = useState(() => {
        try {
            const data = JSON.parse(localStorage.getItem('weatherData'));
            return data?.latitude && data?.longitude ? [data.latitude, data.longitude] : null;
        } catch {
            return null;
        }
    });

    const LocationMarker = () => {
        const map = useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            }
        });
        
        useEffect(() => {
            if (position) {
                map.flyTo(position, map.getZoom());
            }
        }, [position, map]);

        return position === null ? null : (
            <Marker 
                position={position} 
                draggable={true} 
                eventHandlers={{
                    dragend: (e) => {
                        const marker = e.target;
                        const pos = marker.getLatLng();
                        setPosition([pos.lat, pos.lng]);
                    },
                }}
            />
        );
    };

    const requestLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        setLoadingId('locating');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
                setLoadingId(null);
            },
            () => {
                alert('Could not get your location. Please enable location services.');
                setLoadingId(null);
            },
            { enableHighAccuracy: true }
        );
    };

    const submitReport = async () => {
        if (!selectedCategory) return alert("Please select an issue type.");
        if (!position) return alert("Please pinpoint the location on the map.");
        
        setLoadingId('submit');
        
        try {
            const data = {
                category_id: selectedCategory.id,
                title: `Report: ${selectedCategory.name}`,
                description: description || 'No details provided.',
                address: locationInput || 'Map Coordinates',
                latitude: position[0],
                longitude: position[1]
            };
            await api.post('/reports', data);
            await loadData();
            setActiveTab('history');
            alert('Report submitted successfully!');
            setSelectedCategory(null);
            setDescription('');
            setLocationInput('');
        } catch (err) {
            alert('Failed to submit report');
        } finally {
            setLoadingId(null);
        }
    };

    // Helper to map generic categories to nice icons and colors
    const getReportIcon = (name) => {
        const n = name.toLowerCase();
        if (n.includes('crime') || n.includes('security') || n.includes('safety')) return { icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' };
        if (n.includes('traffic') || n.includes('road')) return { icon: Car, color: 'text-amber-600', bg: 'bg-amber-50' };
        if (n.includes('waste') || n.includes('garbage')) return { icon: Trash2, color: 'text-emerald-600', bg: 'bg-emerald-50' };
        if (n.includes('fire')) return { icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' };
        if (n.includes('flood') || n.includes('water')) return { icon: CloudRain, color: 'text-cyan-600', bg: 'bg-cyan-50' };
        if (n.includes('light') || n.includes('electric') || n.includes('power')) return { icon: Sun, color: 'text-yellow-600', bg: 'bg-yellow-50' };
        if (n.includes('noise')) return { icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50' };
        return { icon: AlertTriangle, color: 'text-blue-600', bg: 'bg-blue-50' };
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            <Header title="Report an Issue" />
            
            <div className="max-w-lg mx-auto p-5">

            {/* Flat Toggle Tabs */}
            <div className="flex bg-slate-200/60 p-1 rounded-xl mb-6">
                <button 
                    onClick={() => setActiveTab('reports')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    New Report
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    My Reports
                </button>
            </div>

            {activeTab === 'reports' ? (
                <div className="space-y-6">
                    {/* Issue Type Selection */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Issue Type</h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
                            {categories.map(cat => {
                                const style = getReportIcon(cat.name);
                                const Icon = style.icon;
                                const isSelected = selectedCategory?.id === cat.id;
                                
                                return (
                                    <button 
                                        key={cat.id} 
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`snap-start shrink-0 w-[80px] h-[90px] rounded-[18px] bg-white border ${isSelected ? 'border-blue-500 shadow-sm' : 'border-slate-100'} flex flex-col items-center justify-center text-center gap-2 transition-all active:scale-95`}
                                    >
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : style.bg + ' ' + style.color}`}>
                                            <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
                                        </div>
                                        <span className={`font-semibold text-[10px] leading-tight ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>{cat.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-slate-900">Location</h3>
                            <button onClick={requestLocation} disabled={loadingId === 'locating'} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                                {loadingId === 'locating' ? 'Locating...' : 'Locate Me'}
                            </button>
                        </div>
                        <div className="relative mb-3">
                            <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-4 pr-10 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-medium shadow-sm" placeholder="Search location..." />
                            <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        <div className="w-full h-40 bg-slate-200 rounded-2xl overflow-hidden relative border border-slate-100 shadow-sm z-0">
                            {position ? (
                                <MapContainer 
                                    center={position} 
                                    zoom={15} 
                                    minZoom={13}
                                    maxBounds={BINALBAGAN_BOUNDS}
                                    maxBoundsViscosity={1.0}
                                    scrollWheelZoom={false} 
                                    className="h-full w-full"
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                                    <LocationMarker />
                                </MapContainer>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                                    <MapPin size={24} className="mb-2 opacity-50" />
                                    <span className="text-xs font-semibold">Click "Locate Me" or enter address</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Details</h3>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue..." 
                            className="w-full h-24 bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-medium resize-none shadow-sm"
                        ></textarea>
                    </div>

                    {/* Add Photo */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex justify-between">Add Photo (Optional)</h3>
                        <div className="flex gap-3">
                            <button className="w-20 h-20 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors">
                                <ImageIcon size={24} />
                            </button>
                            <button className="w-20 h-20 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-300 hover:bg-slate-50 transition-colors">
                                <ImageIcon size={24} />
                            </button>
                            <button className="w-20 h-20 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-300 hover:bg-slate-50 transition-colors">
                                <ImageIcon size={24} />
                            </button>
                        </div>
                    </div>

                    <Button 
                        onClick={submitReport} 
                        loading={loadingId === 'submit'}
                        className="w-full mt-4" 
                        size="lg"
                    >
                        Submit Report
                    </Button>
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
        </div>
    );
}
