import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, MapPin, Phone, Mail, ShieldCheck, Check, X, ChevronRight, FileText, Settings, HelpCircle, Info, Briefcase, Camera, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import Card from '../../components/ui/Card';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ 
        contact_number: user?.profile?.contact_number || '', 
        address: user?.profile?.address || '' 
    });
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 400;
                    const MAX_HEIGHT = 400;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
            };
        });
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingAvatar(true);
        try {
            const base64 = await compressImage(file);
            await api.post('/user/profile/avatar', { avatar: base64 });
            window.location.reload();
        } catch (err) {
            alert('Failed to upload image');
        } finally {
            setUploadingAvatar(false);
        }
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
        <div className="bg-slate-50 min-h-screen pb-24">
            
            {/* Premium Blue Header Background */}
            <div className="bg-blue-600 pt-16 pb-24 px-6 relative overflow-hidden rounded-b-[40px] shadow-md">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/50 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center font-black text-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-4 border-white/20 overflow-hidden mb-4">
                            {user?.profile_photo_path ? (
                                <img src={user.profile_photo_path} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                `${user?.first_name?.charAt(0) || ''}${user?.last_name?.charAt(0) || ''}`
                            )}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" />
                        <button disabled={uploadingAvatar} onClick={() => fileInputRef.current?.click()} className="absolute bottom-4 right-0 bg-blue-700 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm hover:bg-blue-800 transition-colors disabled:opacity-50">
                            <Camera size={14} />
                        </button>
                    </div>

                    <h2 className="text-2xl font-black text-white tracking-tight">{user?.first_name} {user?.last_name}</h2>
                    <p className="text-blue-100 font-medium text-sm mt-1 mb-3">{user?.email}</p>
                    
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm">
                        <ShieldCheck size={14} className="text-green-300" />
                        Verified Resident
                    </div>
                </div>
            </div>
            
            <div className="max-w-lg mx-auto px-5 -mt-10 relative z-20">

                {/* Main Menu Options */}
                <div className="space-y-4">
                    <Card className="overflow-hidden">
                        <div className="p-2 space-y-1">
                            <button onClick={() => navigate('/resident/reports')} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <AlertTriangle size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="font-semibold text-sm text-slate-900">My Reports</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </button>
                            
                            <button onClick={() => navigate('/resident/services')} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                        <Briefcase size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="font-semibold text-sm text-slate-900">My Requests</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            </button>
                            
                            <button onClick={() => navigate('/resident/services')} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                        <FileText size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="font-semibold text-sm text-slate-900">My Documents</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                            </button>
                        </div>
                    </Card>

                    <Card className="overflow-hidden">
                        <div className="p-2 space-y-1">
                            <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                        <Settings size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="font-semibold text-sm text-slate-900">Settings</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                            </button>
                            
                            <button onClick={() => alert('Please contact support@barangaylink.com for assistance.')} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                        <HelpCircle size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="font-semibold text-sm text-slate-900">Help & Support</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                            </button>
                            
                            <button onClick={() => alert('BarangayLink v1.0.0 - A Premium Citizen Services App')} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                        <Info size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="font-semibold text-sm text-slate-900">About BarangayLink</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                            </button>
                        </div>
                    </Card>
                    
                    <button onClick={handleLogout} className="w-full mt-4 flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 z-40 flex flex-col justify-end">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
                        <div className="relative bg-white w-full max-w-lg mx-auto rounded-t-[30px] p-6 pb-32 animate-in slide-in-from-bottom-full duration-300">
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Edit Profile</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                                    <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:border-blue-500 focus:outline-none" value={form.contact_number} onChange={e => setForm({...form, contact_number: e.target.value})} placeholder="e.g. 09123456789" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Address</label>
                                    <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:border-blue-500 focus:outline-none min-h-[100px] resize-none" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Full address"></textarea>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setIsEditing(false)} className="py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl">Cancel</button>
                                <button onClick={handleSave} disabled={loading} className="py-3.5 bg-blue-600 text-white font-bold rounded-xl">{loading ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
