import { useState, useEffect } from 'react';
import { 
    Calendar as CalendarIcon, Search, Plus, MapPin, 
    Clock, Users, MoreVertical, Edit, Trash2
} from 'lucide-react';
import api from '../../lib/axios';

export default function Events() {
    const [search, setSearch] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    const getStatusBadge = (dateStr) => {
        const today = new Date();
        const eventDate = new Date(dateStr);
        if (eventDate < today) return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">Past</span>;
        const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays <= 2) return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-50 text-red-700">Soon</span>;
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700">Upcoming</span>;
    };

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <CalendarIcon className="text-blue-600" />
                        Community Events
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage barangay activities, assemblies, and programs.</p>
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
                    <Plus size={18} />
                    Create Event
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="p-4 border-b border-slate-100 flex items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search events..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto flex-1 custom-scrollbar p-6 space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-40"><p className="text-slate-500">Loading events...</p></div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
                            <CalendarIcon size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-1">No events found</h3>
                            <p className="text-slate-500 text-sm">Create a new event to keep the community updated.</p>
                        </div>
                    ) : filteredEvents.map(event => {
                        const dateObj = new Date(event.start_date);
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
                                        {getStatusBadge(event.start_date)}
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 truncate mb-2 group-hover:text-blue-700 transition-colors">{event.title}</h2>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-slate-400" />
                                            {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-slate-400" />
                                            <span className="truncate max-w-[200px]">{event.location}</span>
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
