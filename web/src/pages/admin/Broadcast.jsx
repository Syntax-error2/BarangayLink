import { useState } from 'react';
import { Radio, Smartphone, BellRing, Send, AlertTriangle, Users } from 'lucide-react';
import api from '../../lib/axios';

export default function Broadcast() {
    const [message, setMessage] = useState('');
    const [channels, setChannels] = useState({ sms: true, app: true });
    const [targetAudience, setTargetAudience] = useState('all');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/broadcast', {
                message,
                type: 'alert',
                audience: targetAudience
            });
            alert('Broadcast dispatched successfully!');
            setMessage('');
        } catch (error) {
            console.error('Failed to dispatch broadcast:', error);
            alert('Failed to send broadcast.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Radio className="text-blue-600" />
                    Emergency Broadcast System
                </h1>
                <p className="text-sm text-slate-500 mt-1">Send mass SMS and push notifications to residents.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                <form onSubmit={handleSend} className="space-y-8">
                    
                    {/* Message Body */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-900">Broadcast Message</label>
                        <div className="relative">
                            <textarea 
                                rows="5"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter the critical announcement or emergency alert here..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                                required
                            ></textarea>
                            <span className={`absolute bottom-4 right-4 text-xs font-bold ${message.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>
                                {message.length}/160 chars (1 SMS message)
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Target Audience */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-900">Target Audience</label>
                            <div className="space-y-3">
                                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${targetAudience === 'all' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <input type="radio" name="audience" value="all" checked={targetAudience === 'all'} onChange={() => setTargetAudience('all')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900 flex items-center gap-2"><Users size={16} className="text-slate-500" /> All Residents</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Reach everyone registered in the system.</p>
                                    </div>
                                </label>
                                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${targetAudience === 'responders' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <input type="radio" name="audience" value="responders" checked={targetAudience === 'responders'} onChange={() => setTargetAudience('responders')} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900 flex items-center gap-2"><AlertTriangle size={16} className="text-slate-500" /> Responders Only</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Send alerts specifically to emergency teams.</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Delivery Channels */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-900">Delivery Channels</label>
                            <div className="space-y-3">
                                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${channels.sms ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${channels.sms ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <Smartphone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">SMS Text Message</p>
                                            <p className="text-[11px] text-slate-500 mt-0.5">Direct to mobile numbers.</p>
                                        </div>
                                    </div>
                                    <input type="checkbox" checked={channels.sms} onChange={() => setChannels({...channels, sms: !channels.sms})} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                                </label>
                                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${channels.app ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${channels.app ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <BellRing size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Push Notification</p>
                                            <p className="text-[11px] text-slate-500 mt-0.5">Alert on the BarangayLink app.</p>
                                        </div>
                                    </div>
                                    <input type="checkbox" checked={channels.app} onChange={() => setChannels({...channels, app: !channels.app})} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                            <AlertTriangle size={16} className="text-amber-500" />
                            Please verify the message before sending. This cannot be undone.
                        </p>
                        <button 
                            type="submit" 
                            disabled={loading || !message.trim() || (!channels.sms && !channels.app)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm"
                        >
                            <Send size={18} />
                            {loading ? 'Dispatching...' : 'Dispatch Broadcast'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
