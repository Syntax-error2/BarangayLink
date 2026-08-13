import React from 'react';
import QRCode from 'react-qr-code';
import { ShieldCheckIcon, IdentificationIcon } from '@heroicons/react/24/solid';
import { getImageUrl } from '../lib/axios';
import { useAuth } from '../context/AuthContext';

const DigitalIdCard = () => {
    const { user } = useAuth();

    if (!user) return null;

    // We use a combination of user ID and email or a dedicated QR token if available.
    // For now, generating a JSON string with user basic info or just the ID.
    const qrData = JSON.stringify({
        id: user.id,
        type: 'resident_id'
    });

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 shadow-xl text-white">
            {/* Glassmorphism subtle overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            
            {/* Background design elements */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                {/* Header */}
                <div className="flex w-full justify-between items-center mb-6 border-b border-white/20 pb-4">
                    <div className="flex items-center space-x-2">
                        <ShieldCheckIcon className="h-6 w-6 text-white" />
                        <span className="font-bold tracking-wider uppercase text-sm">BarangayLink ID</span>
                    </div>
                    {user.barangay && (
                        <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded-md backdrop-blur-md">
                            Brgy. {user.barangay.name}
                        </div>
                    )}
                </div>

                {/* Profile Info */}
                <div className="flex w-full items-center space-x-4 mb-6">
                    <div className="h-20 w-20 rounded-full border-4 border-white/30 overflow-hidden bg-white/20 shadow-inner flex items-center justify-center">
                        {user.profile_photo_path ? (
                            <img src={getImageUrl(user.profile_photo_path)} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <IdentificationIcon className="h-10 w-10 text-white/70" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold leading-tight">{user.first_name} {user.last_name}</h2>
                        <p className="text-sm text-white/80 uppercase tracking-widest mt-1 font-medium">{user.role?.name || 'Resident'}</p>
                        <p className="text-xs text-white/60 mt-1">ID: {String(user.id).padStart(6, '0')}</p>
                    </div>
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-3 rounded-xl shadow-lg mt-2">
                    <QRCode
                        value={qrData}
                        size={140}
                        bgColor="#ffffff"
                        fgColor="#0F172A"
                        level="H"
                    />
                </div>
                
                <p className="text-xs text-white/60 mt-4 text-center">
                    Present this QR code to authorized personnel for verification.
                </p>
            </div>
        </div>
    );
};

export default DigitalIdCard;
