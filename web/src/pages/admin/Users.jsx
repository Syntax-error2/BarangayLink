import { useState } from 'react';
import { 
    ShieldCheck, Search, Plus, MoreVertical, 
    Edit, Trash2, Mail, BadgeCheck, UserCog
} from 'lucide-react';

export default function Users() {
    const [search, setSearch] = useState('');

    const mockUsers = [
        { id: 1, name: 'Admin Dave', role: 'Super Admin', email: 'dave@barangaylink.com', status: 'active', last_login: '2 mins ago' },
        { id: 2, name: 'Barangay Captain', role: 'Barangay Admin', email: 'captain@barangaylink.com', status: 'active', last_login: '1 hour ago' },
        { id: 3, name: 'John Staff', role: 'Staff', email: 'staff1@barangaylink.com', status: 'active', last_login: '3 hours ago' },
        { id: 4, name: 'Emergency Team', role: 'Responder', email: 'rescue@barangaylink.com', status: 'offline', last_login: 'Yesterday' },
        { id: 5, name: 'Jane Clerk', role: 'Staff', email: 'clerk@barangaylink.com', status: 'active', last_login: '5 hours ago' },
    ];

    const filteredUsers = mockUsers.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.role.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleColor = (role) => {
        switch(role) {
            case 'Super Admin': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Barangay Admin': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Responder': return 'bg-red-100 text-red-700 border-red-200';
            case 'Staff': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <ShieldCheck className="text-blue-600" />
                        System Users & Roles
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage administrators, staff, and responder accounts.</p>
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
                    <Plus size={18} />
                    Add New User
                </button>
            </div>

            {/* Top Stats & Search */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <UserCog size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Total Admins</p>
                        <p className="text-2xl font-black text-slate-900">2</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <BadgeCheck size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Active Staff</p>
                        <p className="text-2xl font-black text-slate-900">3</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex-1 overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role & Permissions</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Login</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Mail size={10} /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-slate-600 font-medium">{user.last_login}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`h-2 w-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                            <span className="text-xs font-bold text-slate-700 capitalize">{user.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit User">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete User">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="More Options">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
