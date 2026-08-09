import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, MapPin, Phone, Mail, ShieldCheck, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ 
        contact_number: user?.profile?.contact_number || '', 
        address: user?.profile?.address || '' 
    });
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.put('/user/profile', form);
            window.location.reload();
        } catch (e) {
            alert('Failed to update profile');
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen pb-32">
            <div className="fixed top-16 left-0 w-full z-10 p-4 px-6 bg-white shadow-sm border-b border-border flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-text-primary tracking-tight">My Profile</h2>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Account Details</p>
                </div>
            </div>
            
            <div className="max-w-lg mx-auto px-6 pt-[88px]">

            {/* Flat ID Card */}
            <div className="card bg-primary p-6 mb-8 border-0 text-white shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-white text-primary flex items-center justify-center font-black text-3xl shadow-sm">
                        {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black">{user?.first_name} {user?.last_name}</h3>
                        <p className="text-blue-100 text-sm font-medium flex items-center gap-1.5 mt-0.5">
                            <ShieldCheck size={16} className="text-green-300" />
                            Verified Resident
                        </p>
                        <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mt-2">ID: BL-{user?.id.toString().padStart(4, '0')}</p>
                    </div>
                </div>
            </div>

            {/* Contact Information / Edit Mode */}
            <div className="mb-8">
                <div className="flex justify-between items-end mb-2 ml-4 pr-2">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Contact Information</h4>
                </div>
                
                <div className="card bg-white border-border shadow-sm overflow-hidden">
                    <div className="flex items-center gap-4 p-4 border-b border-border/50 bg-gray-50">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center">
                            <Mail size={20} />
                        </div>
                        <div className="flex-1 opacity-70">
                            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Email (Unchangeable)</p>
                            <p className="text-sm font-semibold text-text-primary">{user?.email}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 border-b border-border/50 bg-white">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-success flex items-center justify-center">
                            <Phone size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Phone</p>
                            {isEditing ? (
                                <input type="tel" className="input-field mt-1" value={form.contact_number} onChange={e => setForm({...form, contact_number: e.target.value})} placeholder="e.g. 09123456789" />
                            ) : (
                                <p className="text-sm font-semibold text-text-primary mt-1">{user?.profile?.contact_number || 'Not provided'}</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-white">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-warning flex items-center justify-center">
                            <MapPin size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Address</p>
                            {isEditing ? (
                                <textarea className="input-field mt-1 min-h-[60px]" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Full address"></textarea>
                            ) : (
                                <p className="text-sm font-semibold text-text-primary leading-tight mt-1">{user?.profile?.address || 'Not provided'}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {isEditing ? (
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setIsEditing(false)} className="w-full bg-gray-100 text-text-primary font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                            <X size={18} /> Cancel
                        </button>
                        <button onClick={handleSave} disabled={loading} className="w-full bg-primary text-white font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
                            <Check size={18} /> {loading ? 'Saving...' : 'Save Details'}
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-text-primary font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                        <User size={18} className="text-text-secondary" /> Edit Personal Details
                    </button>
                )}
                
                {!isEditing && (
                    <button onClick={handleLogout} className="w-full bg-red-50 text-danger font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mt-6">
                        <LogOut size={18} /> Sign Out
                    </button>
                )}
            </div>
            </div>
        </div>
    );
}
