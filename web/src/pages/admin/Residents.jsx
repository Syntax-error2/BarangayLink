import { useState, useEffect } from 'react';
import { 
    Users, Search, Filter, MoreVertical, 
    UserCheck, UserX, Download, MapPin, Phone, Mail
} from 'lucide-react';
import api from '../../lib/axios';

export default function Residents() {
    const [search, setSearch] = useState('');
    const [filterPurok, setFilterPurok] = useState('All Puroks');
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResidents();
    }, []);

    const fetchResidents = async () => {
        try {
            const response = await api.get('/users/residents');
            setResidents(response.data);
        } catch (error) {
            console.error('Failed to fetch residents:', error);
        } finally {
            setLoading(false);
        }
    };

    const puroks = ['All Puroks', 'Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5'];

    const filteredResidents = residents.filter(r => {
        const matchesSearch = (r.first_name + ' ' + r.last_name).toLowerCase().includes(search.toLowerCase());
        const matchesPurok = filterPurok === 'All Puroks' || r.purok === filterPurok;
        return matchesSearch && matchesPurok;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'verified': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'suspended': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Users className="text-blue-600" />
                        Resident Directory
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and view all registered residents in the barangay.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 shrink-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search residents by name..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative min-w-[160px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                            value={filterPurok}
                            onChange={(e) => setFilterPurok(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                        >
                            {puroks.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex-1 overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Resident Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredResidents.map((resident) => (
                                <tr key={resident.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                {resident.first_name.charAt(0)}{resident.last_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{resident.first_name} {resident.last_name}</p>
                                                <p className="text-[11px] text-slate-500">ID: RES-{resident.id.toString().padStart(5, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-slate-600 flex items-center gap-1.5"><Phone size={14} className="text-slate-400"/> {resident.phone}</span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1.5"><Mail size={14} className="text-slate-400"/> {resident.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                                            <MapPin size={12} className="text-slate-500" />
                                            {resident.purok}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${getStatusColor(resident.status)}`}>
                                            {resident.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
                                                <UserCheck size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="More Actions">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredResidents.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <Users size={48} className="mb-4 text-slate-300" strokeWidth={1.5} />
                            <p className="text-base font-medium text-slate-600">No residents found</p>
                            <p className="text-sm">Adjust your search or filters to see results.</p>
                        </div>
                    )}
                </div>
                
                {/* Pagination */}
                <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center justify-between shrink-0">
                    <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="font-bold text-slate-900">{filteredResidents.length}</span> results
                    </p>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-slate-200 rounded bg-white text-xs font-medium text-slate-600 hover:bg-slate-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded bg-white text-xs font-medium text-slate-600 hover:bg-slate-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
