import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Flame, Stethoscope, AlertTriangle, Crosshair } from 'lucide-react';

export default function SOS() {
    const [categories, setCategories] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null); // { id, name }
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data.emergencies || []));
    }, []);

    const executeDispatch = async (categoryId, categoryName) => {
        setConfirmModal(null);
        setLoadingId(categoryId);
        
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser. Cannot dispatch SOS.");
            setLoadingId(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                try {
                    let locationString = 'Current GPS Location';
                    try {
                        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
                        const geoData = await geoRes.json();
                        locationString = geoData.locality || geoData.city || 'GPS Location Pinned';
                    } catch (e) {
                        // ignore error
                    }

                    const data = {
                        category_id: categoryId,
                        contact_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Resident',
                        contact_phone: user?.profile?.contact_number || 'N/A',
                        address: locationString,
                        latitude: lat,
                        longitude: lon,
                        description: `1-Click SOS Dispatch from Mobile App.`
                    };
                    
                    await api.post('/emergencies', data);
                    alert('S.O.S DISPATCHED SUCCESSFULLY! Help is on the way.');
                    navigate('/resident');
                } catch (err) {
                    alert('CRITICAL ERROR: Failed to dispatch SOS. Please call emergency hotline immediately.');
                } finally {
                    setLoadingId(null);
                }
            },
            () => {
                alert('LOCATION DENIED. We cannot send responders without your GPS location. Please enable location services immediately.');
                setLoadingId(null);
            },
            { enableHighAccuracy: true }
        );
    };

    const getEmergencyIcon = (name) => {
        const n = name.toLowerCase();
        if (n.includes('police') || n.includes('crime')) return { icon: ShieldAlert, color: 'text-blue-600', bg: 'bg-blue-100', shadow: 'hover:shadow-[0_8px_30px_rgb(37,99,235,0.3)]' };
        if (n.includes('fire')) return { icon: Flame, color: 'text-orange-600', bg: 'bg-orange-100', shadow: 'hover:shadow-[0_8px_30px_rgb(234,88,12,0.3)]' };
        if (n.includes('medical') || n.includes('ambulance') || n.includes('health')) return { icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-100', shadow: 'hover:shadow-[0_8px_30px_rgb(225,29,72,0.3)]' };
        if (n.includes('rescue')) return { icon: Crosshair, color: 'text-emerald-600', bg: 'bg-emerald-100', shadow: 'hover:shadow-[0_8px_30px_rgb(16,185,129,0.3)]' };
        return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', shadow: 'hover:shadow-[0_8px_30px_rgb(220,38,38,0.3)]' };
    };

    return (
        <div className="max-w-lg mx-auto p-6 min-h-screen pb-32 relative bg-red-50">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-red-600 tracking-tight flex items-center gap-3">
                    <span className="relative flex h-4 w-4 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
                    </span>
                    S.O.S DISPATCH
                </h2>
                <button onClick={() => navigate(-1)} className="text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-700 px-3 py-2 bg-white rounded-full shadow-sm">Cancel</button>
            </div>

            <div className="mb-8">
                <div className="bg-red-600 p-6 rounded-3xl text-center shadow-lg shadow-red-600/20">
                    <h3 className="text-white font-black text-xl mb-2">Emergency Hub</h3>
                    <p className="text-red-100 text-sm font-semibold leading-relaxed">Tap an emergency type below to instantly transmit your exact GPS location to responders.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {categories.map(cat => {
                    const style = getEmergencyIcon(cat.name);
                    const Icon = style.icon;
                    const isProcessing = loadingId === cat.id;
                    
                    return (
                        <button 
                            key={cat.id} 
                            disabled={isProcessing || confirmModal !== null}
                            onClick={() => setConfirmModal({ id: cat.id, name: cat.name })}
                            className={`bg-white rounded-3xl p-5 border-2 border-red-100 ${style.shadow} flex flex-col items-center justify-center text-center gap-3 transition-all active:scale-[0.95] ${isProcessing ? 'opacity-70 pointer-events-none' : 'hover:-translate-y-1'}`}
                        >
                            <div className={`h-14 w-14 rounded-[1.25rem] flex items-center justify-center ${style.bg} shrink-0`}>
                                {isProcessing ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current text-gray-500"></div>
                                ) : (
                                    <Icon size={28} className={style.color} strokeWidth={2.2} />
                                )}
                            </div>
                            <span className="font-bold text-[13px] text-gray-900 leading-tight">{cat.name}</span>
                        </button>
                    );
                })}
            </div>

            {confirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl scale-100">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                <AlertTriangle size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Dispatch S.O.S?</h3>
                            <p className="text-gray-500 text-sm font-semibold px-2">
                                You are about to alert responders for <strong className="text-red-600">{confirmModal.name}</strong>. Your exact GPS location will be transmitted immediately.
                            </p>
                        </div>
                        <div className="flex border-t border-gray-100">
                            <button 
                                onClick={() => setConfirmModal(null)} 
                                className="flex-1 py-4 font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => executeDispatch(confirmModal.id, confirmModal.name)}
                                className="flex-1 py-4 font-black text-white bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                CONFIRM
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
