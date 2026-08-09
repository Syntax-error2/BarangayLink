import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Filter, Layers, AlertCircle, FileText } from 'lucide-react';
import api from '../../lib/axios';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default icon issue in React robustly
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Heatmap Layer Component
const HeatmapLayer = ({ points }) => {
    const map = useMap();
    useEffect(() => {
        if (!points || points.length === 0) return;
        
        let heatLayer = null;
        
        const loadHeatmap = async () => {
            try {
                if (!window.L) window.L = L;
                await import('leaflet.heat');
                
                const heatPoints = points.map(p => [parseFloat(p.lat) || 0, parseFloat(p.lng) || 0, p.intensity || 1]);
                heatLayer = L.heatLayer(heatPoints, { radius: 25, blur: 15, maxZoom: 17 }).addTo(map);
            } catch (err) {
                console.error("Failed to load heatmap:", err);
            }
        };
        
        loadHeatmap();

        return () => { 
            if (heatLayer) map.removeLayer(heatLayer); 
        };
    }, [map, points]);
    return null;
};

export default function AdminMap() {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('markers');

    useEffect(() => {
        fetchMapData();
    }, []);

    const fetchMapData = async () => {
        try {
            const res = await api.get('/map-data');
            setPoints(res.data.points || []);
        } catch (error) {
            console.error('Error fetching map data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPoints = points.filter(p => {
        if (filter === 'reports') return p.type === 'report';
        if (filter === 'emergencies') return p.type === 'emergency';
        return true;
    });

    const defaultCenter = [10.1983, 122.8688];

    const safeCenter = points.length > 0 && points[0].lat && points[0].lng 
        ? [parseFloat(points[0].lat), parseFloat(points[0].lng)] 
        : defaultCenter;

    return (
        <div className="flex flex-col h-[calc(100vh-160px)]">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Community Map</h1>
                    <p className="text-slate-500">Visualize reports and emergencies across the barangay</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                        <button 
                            onClick={() => setViewMode('markers')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'markers' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Markers
                        </button>
                        <button 
                            onClick={() => setViewMode('heatmap')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'heatmap' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Heatmap
                        </button>
                    </div>

                    <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('reports')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${filter === 'reports' ? 'bg-amber-50 text-amber-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <FileText size={14} /> Reports
                        </button>
                        <button 
                            onClick={() => setFilter('emergencies')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${filter === 'emergencies' ? 'bg-red-50 text-red-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <AlertCircle size={14} /> Emergencies
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-slate-600 font-medium">Loading map data...</div>
                    </div>
                )}
                <MapContainer 
                    center={safeCenter} 
                    zoom={14} 
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {viewMode === 'heatmap' ? (
                        <HeatmapLayer points={filteredPoints} />
                    ) : (
                        filteredPoints.map((point) => (
                            <Marker key={`${point.type}-${point.id}`} position={[point.lat, point.lng]}>
                                <Popup>
                                    <div className="p-1">
                                        <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${point.type === 'emergency' ? 'text-red-600' : 'text-amber-600'}`}>
                                            {point.type}
                                        </div>
                                        <h3 className="font-bold text-slate-900">{point.title}</h3>
                                        <p className="text-xs text-slate-500 mb-2">{point.category}</p>
                                        <div className="text-xs">
                                            Status: <span className="font-semibold">{point.status}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-2">
                                            {new Date(point.date).toLocaleString()}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
