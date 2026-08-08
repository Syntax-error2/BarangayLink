import { useState, useRef, useEffect } from 'react';
import api from '../../lib/axios';
import { Upload, Image as ImageIcon, Save, CheckCircle2, Building, Mail, Phone, MapPin, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
    const { user, setUser } = useAuth();
    
    // UI State
    const [activeTab, setActiveTab] = useState('identity');
    
    // Logo Upload State
    const [logoLoading, setLogoLoading] = useState(false);
    const [logoSuccess, setLogoSuccess] = useState(false);
    const [logoError, setLogoError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
        user?.barangay?.logo_path ? `http://127.0.0.1:8000/${user.barangay.logo_path}` : null
    );
    const fileInputRef = useRef(null);

    // Barangay Details State
    const [barangayData, setBarangayData] = useState({
        name: user?.barangay?.name || '',
        city: user?.barangay?.city || '',
        province: user?.barangay?.province || '',
        region: user?.barangay?.region || '',
        email: user?.barangay?.email || '',
        contact_number: user?.barangay?.contact_number || '',
        address: user?.barangay?.address || '',
    });
    const [bgLoading, setBgLoading] = useState(false);
    const [bgSuccess, setBgSuccess] = useState(false);
    
    // Security State
    const [securityData, setSecurityData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: ''
    });
    const [secLoading, setSecLoading] = useState(false);
    const [secSuccess, setSecSuccess] = useState(false);
    const [secError, setSecError] = useState(null);

    // Handlers: Logo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
    };

    const handleLogoUpload = async (e) => {
        e.preventDefault();
        const file = fileInputRef.current?.files[0];
        if (!file) return;
        setLogoLoading(true); setLogoError(null); setLogoSuccess(false);
        const formData = new FormData(); formData.append('logo', file);
        try {
            const res = await api.post('/settings/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res.data.barangay) setUser({ ...user, barangay: res.data.barangay });
            setLogoSuccess(true); setTimeout(() => setLogoSuccess(false), 3000);
        } catch (err) {
            console.error("Logo upload error:", err.response?.data || err.message);
            setLogoError(err.response?.data?.message || 'Failed to upload logo');
        } finally { setLogoLoading(false); }
    };

    // Handlers: Barangay Details
    const handleBarangaySave = async (e) => {
        e.preventDefault();
        setBgLoading(true); setBgSuccess(false);
        try {
            const res = await api.put('/settings/barangay', barangayData);
            setUser({ ...user, barangay: res.data.barangay });
            setBgSuccess(true); setTimeout(() => setBgSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally { setBgLoading(false); }
    };

    // Handlers: Security
    const handleSecuritySave = async (e) => {
        e.preventDefault();
        setSecLoading(true); setSecError(null); setSecSuccess(false);
        try {
            const res = await api.put('/settings/security', securityData);
            setUser(res.data.user);
            setSecurityData({ ...securityData, password: '', password_confirmation: '' });
            setSecSuccess(true); setTimeout(() => setSecSuccess(false), 3000);
        } catch (err) {
            setSecError(err.response?.data?.message || 'Failed to update security settings');
        } finally { setSecLoading(false); }
    };

    const tabs = [
        { id: 'identity', label: 'Barangay Identity', icon: Building },
        { id: 'security', label: 'Account Security', icon: Lock },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h2>
                <p className="text-slate-500 mt-1 font-medium">Manage your barangay's profile, contact details, and account security.</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-slate-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all relative ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-xl'}`}
                    >
                        <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Contents */}
            {activeTab === 'identity' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Logo Section */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <ImageIcon size={20} className="text-blue-500" /> Official Logo
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">This logo will be used on the sidebar and as a watermark for official documents.</p>
                        </div>
                        <div className="p-6 sm:p-8">
                            <form onSubmit={handleLogoUpload} className="flex flex-col sm:flex-row gap-8 items-start">
                                <div className="shrink-0">
                                    <div className="w-40 h-40 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative group">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                                        ) : (
                                            <div className="text-slate-400 flex flex-col items-center">
                                                <ImageIcon size={32} strokeWidth={1.5} className="mb-2" />
                                                <span className="text-xs font-semibold">No Logo</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow-sm active:scale-95 transition-transform">
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <ul className="text-xs font-medium text-slate-500 space-y-2 list-disc list-inside bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <li>Recommended size: 500x500 pixels</li>
                                        <li>Formats: PNG, SVG (Transparent background preferred)</li>
                                        <li>Maximum file size: 5MB</li>
                                    </ul>
                                    <input type="file" accept="image/png, image/jpeg, image/svg+xml" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                    <div className="pt-2 flex gap-3">
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2 shadow-sm">
                                            <Upload size={16} /> Select File
                                        </button>
                                        <button type="submit" disabled={logoLoading} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:cursor-not-allowed">
                                            {logoLoading ? 'Uploading...' : <><Save size={16} /> Save Logo</>}
                                        </button>
                                    </div>
                                    {logoError && <p className="text-red-500 text-sm font-medium mt-2">{logoError}</p>}
                                    {logoSuccess && <p className="text-emerald-600 text-sm font-bold mt-2 flex items-center gap-1"><CheckCircle2 size={16} /> Logo uploaded successfully!</p>}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Barangay Details & Contact Form */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Building size={20} className="text-indigo-500" /> Barangay Profile
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">Official details used in generated documents and contact pages.</p>
                            </div>
                        </div>
                        <div className="p-6 sm:p-8">
                            <form onSubmit={handleBarangaySave} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Barangay Name</label>
                                        <input type="text" value={barangayData.name} onChange={e => setBarangayData({...barangayData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Municipality / City</label>
                                        <input type="text" value={barangayData.city} onChange={e => setBarangayData({...barangayData, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Province</label>
                                        <input type="text" value={barangayData.province} onChange={e => setBarangayData({...barangayData, province: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Region</label>
                                        <input type="text" value={barangayData.region} onChange={e => setBarangayData({...barangayData, region: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" required />
                                    </div>
                                </div>
                                
                                <hr className="border-slate-100" />
                                
                                <div className="space-y-6">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">Contact Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Mail size={14}/> Official Email</label>
                                            <input type="email" value={barangayData.email} onChange={e => setBarangayData({...barangayData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Phone size={14}/> Contact Number</label>
                                            <input type="text" value={barangayData.contact_number} onChange={e => setBarangayData({...barangayData, contact_number: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><MapPin size={14}/> Office Address</label>
                                            <input type="text" value={barangayData.address} onChange={e => setBarangayData({...barangayData, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end items-center gap-4 pt-4">
                                    {bgSuccess && <p className="text-emerald-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 size={16} /> Profile saved successfully!</p>}
                                    <button type="submit" disabled={bgLoading} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(79,70,229,0.3)] disabled:opacity-70 disabled:cursor-not-allowed">
                                        {bgLoading ? 'Saving...' : <><Save size={16} /> Save Profile</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <UserIcon size={20} className="text-emerald-500" /> Admin Credentials
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Update your personal account details and password.</p>
                        </div>
                        <div className="p-6 sm:p-8">
                            <form onSubmit={handleSecuritySave} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                                        <input type="text" value={securityData.first_name} onChange={e => setSecurityData({...securityData, first_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                                        <input type="text" value={securityData.last_name} onChange={e => setSecurityData({...securityData, last_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" required />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                                        <input type="email" value={securityData.email} onChange={e => setSecurityData({...securityData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" required />
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                <div className="space-y-6">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">Change Password</h4>
                                    <p className="text-xs font-medium text-slate-500">Leave blank if you do not wish to change your password.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                                            <input type="password" value={securityData.password} onChange={e => setSecurityData({...securityData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                                            <input type="password" value={securityData.password_confirmation} onChange={e => setSecurityData({...securityData, password_confirmation: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>

                                {secError && <p className="text-red-500 text-sm font-medium mt-2">{secError}</p>}

                                <div className="flex justify-end items-center gap-4 pt-4">
                                    {secSuccess && <p className="text-emerald-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 size={16} /> Account updated successfully!</p>}
                                    <button type="submit" disabled={secLoading} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(16,185,129,0.3)] disabled:opacity-70 disabled:cursor-not-allowed">
                                        {secLoading ? 'Saving...' : <><Save size={16} /> Save Security</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
