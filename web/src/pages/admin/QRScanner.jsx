import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import { ShieldCheck, XCircle, User as UserIcon, MapPin, Phone } from 'lucide-react';
import api from '../../lib/axios';
import { getImageUrl } from '../../lib/axios';

export default function QRScanner() {
    const [scanResult, setScanResult] = useState(null);
    const [resident, setResident] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Initialize Scanner
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: { width: 250, height: 250 },
            fps: 10,
        });

        scanner.render(success, error);

        async function success(result) {
            scanner.clear();
            setScanResult(result);
            verifyQR(result);
        }

        function error(err) {
            // console.warn(err);
        }

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    const verifyQR = async (qrString) => {
        setLoading(true);
        setError(null);
        setResident(null);
        try {
            // Parse if it's JSON
            let payload = qrString;
            try {
                payload = JSON.parse(qrString);
            } catch (e) {
                // If not JSON, send as raw string
            }

            const response = await api.post('/admin/verify-qr', { qr_data: payload });
            setResident(response.data.resident);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or unrecognized QR Code.');
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        window.location.reload();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <SectionHeader title="Resident QR Verification" description="Scan a resident's Digital Barangay ID to verify their identity." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                    {!scanResult && !loading && (
                        <div id="reader" className="w-full max-w-sm mx-auto border-none rounded-xl overflow-hidden"></div>
                    )}
                    
                    {loading && (
                        <div className="flex flex-col items-center space-y-4 animate-pulse">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-semibold uppercase tracking-widest text-sm">Verifying Identity...</p>
                        </div>
                    )}

                    {(scanResult && !loading) && (
                        <button onClick={resetScanner} className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors">
                            Scan Another ID
                        </button>
                    )}
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Verification Result</h3>
                    
                    {!scanResult && !loading && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <ShieldCheck size={48} className="mb-2 opacity-50" />
                            <p>Waiting for scan...</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center h-64 text-red-500 space-y-3 bg-red-50 rounded-xl">
                            <XCircle size={48} />
                            <h4 className="font-bold text-lg">Verification Failed</h4>
                            <p className="text-sm text-red-400 text-center px-4">{error}</p>
                        </div>
                    )}

                    {resident && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-100">
                                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-green-800">Verified Resident</h4>
                                    <p className="text-xs text-green-600 font-medium uppercase tracking-wider">ID matches database records</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                                    {resident.profile_photo_path ? (
                                        <img src={getImageUrl(resident.profile_photo_path)} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon size={40} className="text-slate-300" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                                        {resident.first_name} {resident.last_name}
                                    </h2>
                                    <p className="text-blue-600 font-bold uppercase tracking-wider text-xs mb-2">ID: {String(resident.id).padStart(6, '0')}</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                        {resident.role?.name || 'Resident'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin size={16} className="text-slate-400 shrink-0" />
                                    <span className="text-slate-700 font-medium">{resident.profile?.address || 'Address not provided'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone size={16} className="text-slate-400 shrink-0" />
                                    <span className="text-slate-700 font-medium">{resident.profile?.contact_number || 'Contact not provided'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
