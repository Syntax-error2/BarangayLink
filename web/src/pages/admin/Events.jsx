import { useState } from 'react';
import { 
    Calendar as CalendarIcon, Plus, MoreVertical, 
    MapPin, Clock, Users, Edit, Trash2
} from 'lucide-react';

export default function Events() {
    const mockEvents = [
        { id: 1, title: 'Barangay Assembly Meeting', date: '2026-08-15', time: '09:00 AM - 12:00 PM', location: 'Barangay Covered Court', attendees: 150, status: 'Upcoming', type: 'Assembly' },
        { id: 2, title: 'Medical Mission & Vaccination', date: '2026-08-20', time: '08:00 AM - 05:00 PM', location: 'Health Center', attendees: 300, status: 'Upcoming', type: 'Health' },
        { id: 3, title: 'Youth Basketball League Finals', date: '2026-08-25', time: '04:00 PM - 07:00 PM', location: 'Barangay Covered Court', attendees: 500, status: 'Upcoming', type: 'Sports' },
        { id: 4, title: 'Coastal Clean-up Drive', date: '2026-08-01', time: '06:00 AM - 09:00 AM', location: 'Purok 5 Shoreline', attendees: 85, status: 'Completed', type: 'Environment' },
        { id: 5, title: 'Senior Citizens Benefit Payout', date: '2026-08-10', time: '08:00 AM - 03:00 PM', location: 'Barangay Hall', attendees: 200, status: 'Completed', type: 'Social Service' },
    ];

    const getStatusColor = (status) => {
        if (status === 'Upcoming') return 'bg-blue-100 text-blue-700';
        if (status === 'Ongoing') return 'bg-emerald-100 text-emerald-700';
        return 'bg-slate-100 text-slate-600';
    };

    const getTypeColor = (type) => {
        switch(type) {
            case 'Assembly': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Health': return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'Sports': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Environment': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Social Service': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <CalendarIcon className="text-blue-600" />
                        Events & Activities
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Schedule and manage barangay events, meetings, and programs.</p>
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
                    <Plus size={18} />
                    Create New Event
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto flex-1 custom-scrollbar p-6 space-y-4">
                    {mockEvents.map(event => {
                        const dateObj = new Date(event.date);
                        return (
                            <div key={event.id} className="flex flex-col md:flex-row gap-6 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all group bg-white">
                                {/* Date Block */}
                                <div className="flex flex-col items-center justify-center w-24 h-24 bg-slate-50 rounded-2xl border border-slate-100 shrink-0 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{dateObj.toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-3xl font-black text-blue-600 leading-none my-1">{dateObj.getDate()}</span>
                                    <span className="text-[10px] font-semibold text-slate-400">{dateObj.getFullYear()}</span>
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getTypeColor(event.type)}`}>
                                            {event.type}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 truncate mb-2 group-hover:text-blue-700 transition-colors">{event.title}</h2>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-slate-400" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-slate-400" />
                                            <span className="truncate max-w-[200px]">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users size={14} className="text-slate-400" />
                                            {event.attendees} expected
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-start md:items-center justify-end gap-2 shrink-0 md:border-l border-slate-100 md:pl-6">
                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Edit Event">
                                        <Edit size={18} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete Event">
                                        <Trash2 size={18} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors" title="More Options">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
