import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Megaphone, Plus, X, Send, Calendar, User, Info, AlertTriangle, CalendarDays, Bell } from 'lucide-react';

export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', type: 'General' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data);
        } catch (err) {
            console.error('Failed to load announcements', err);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/announcements', form);
            setIsCreating(false);
            setForm({ title: '', content: '', type: 'General' });
            loadAnnouncements();
        } catch (err) {
            alert('Failed to post announcement');
        } finally {
            setLoading(false);
        }
    };

    const getTypeConfig = (type) => {
        switch (type) {
            case 'Alert':
                return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle };
            case 'Event':
                return { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: CalendarDays };
            case 'Advisory':
                return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Bell };
            default:
                return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Info };
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Megaphone className="text-blue-600" size={32} />
                        Announcements
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Broadcast important messages to all residents.</p>
                </div>
                <button 
                    onClick={() => setIsCreating(!isCreating)} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] ${
                        isCreating 
                        ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50' 
                        : 'bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-blue-700'
                    }`}
                >
                    {isCreating ? <><X size={18} /> Cancel</> : <><Plus size={18} /> New Announcement</>}
                </button>
            </div>

            {isCreating && (
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Send className="text-blue-600" size={20} />
                        Create Announcement
                    </h2>
                    <form onSubmit={submit} className="space-y-5 max-w-2xl">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Title</label>
                            <input 
                                type="text" 
                                required 
                                value={form.title} 
                                onChange={e => setForm({...form, title: e.target.value})} 
                                placeholder="e.g. Scheduled Water Interruption Tomorrow" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 font-medium text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Type / Category</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none font-medium text-slate-900 cursor-pointer" 
                                    value={form.type} 
                                    onChange={e => setForm({...form, type: e.target.value})}
                                >
                                    <option value="General">General Info</option>
                                    <option value="Alert">Alert / Warning</option>
                                    <option value="Event">Community Event</option>
                                    <option value="Advisory">Public Advisory</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Content</label>
                            <textarea 
                                required 
                                value={form.content} 
                                onChange={e => setForm({...form, content: e.target.value})} 
                                placeholder="Type the full broadcast message here..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 min-h-[140px] resize-y font-medium text-slate-900 leading-relaxed"
                            ></textarea>
                        </div>
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <><Send size={18} /> Post Announcement</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                            <Megaphone size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No Announcements Yet</h3>
                        <p className="text-slate-500 text-sm mt-1">Broadcast your first message to the community.</p>
                    </div>
                ) : (
                    announcements.map(ann => {
                        const config = getTypeConfig(ann.type);
                        const Icon = config.icon;
                        return (
                            <div key={ann.id} className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 flex flex-col h-full hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.color} ${config.border}`}>
                                        <Icon size={12} />
                                        {ann.type || 'General'}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{ann.title}</h3>
                                <p className="text-sm text-slate-600 whitespace-pre-wrap flex-1 leading-relaxed">{ann.content}</p>
                                
                                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <User size={14} className="text-slate-400" />
                                        <span>{ann.author?.first_name} {ann.author?.last_name}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-slate-400" />
                                        <span>{new Date(ann.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
