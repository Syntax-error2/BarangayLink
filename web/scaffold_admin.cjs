const fs = require('fs');
const path = require('path');

const files = {
    'src/pages/admin/AdminLayout.jsx': `import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, Briefcase, AlertTriangle, Map } from 'lucide-react';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex bg-background">
            <aside className="w-64 bg-white border-r border-border hidden md:flex flex-col">
                <div className="p-4 border-b border-border">
                    <h1 className="font-bold text-xl text-primary">BarangayLink</h1>
                    <span className="text-xs text-text-secondary">Admin Portal</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium \${isActive('/admin') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50'}\`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/admin/reports" className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium \${isActive('/admin/reports') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50'}\`}>
                        <FileText size={20} /> Reports
                    </Link>
                    <Link to="/admin/services" className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium \${isActive('/admin/services') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50'}\`}>
                        <Briefcase size={20} /> Services
                    </Link>
                    <Link to="/admin/emergencies" className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium \${isActive('/admin/emergencies') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50'}\`}>
                        <AlertTriangle size={20} /> Emergencies
                    </Link>
                </nav>
            </aside>
            
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
                    <h2 className="font-semibold text-text-primary capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-text-secondary">{user?.first_name} {user?.last_name} ({user?.role.name})</span>
                        <button onClick={logout} className="p-2 text-text-secondary hover:text-danger"><LogOut size={20} /></button>
                    </div>
                </header>
                
                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
`,
    'src/pages/admin/Dashboard.jsx': `import { useState, useEffect } from 'react';
import api from '../../lib/axios';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total_reports: 0, pending_requests: 0, active_emergencies: 0, resolved_reports: 0 });

    useEffect(() => {
        api.get('/dashboard').then(res => setStats(res.data));
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6 border-l-4 border-l-primary">
                <h3 className="text-sm font-medium text-text-secondary mb-1">Total Reports</h3>
                <p className="text-3xl font-bold text-text-primary">{stats.total_reports}</p>
            </div>
            <div className="card p-6 border-l-4 border-l-danger">
                <h3 className="text-sm font-medium text-text-secondary mb-1">Active Emergencies</h3>
                <p className="text-3xl font-bold text-danger">{stats.active_emergencies}</p>
            </div>
            <div className="card p-6 border-l-4 border-l-warning">
                <h3 className="text-sm font-medium text-text-secondary mb-1">Pending Services</h3>
                <p className="text-3xl font-bold text-warning">{stats.pending_requests}</p>
            </div>
            <div className="card p-6 border-l-4 border-l-success">
                <h3 className="text-sm font-medium text-text-secondary mb-1">Resolved Reports</h3>
                <p className="text-3xl font-bold text-success">{stats.resolved_reports}</p>
            </div>
        </div>
    );
}
`,
    'src/pages/admin/Reports.jsx': `import { useState, useEffect } from 'react';
import api from '../../lib/axios';

export default function AdminReports() {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        api.get('/reports').then(res => setReports(res.data));
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(\`/reports/\${id}/status\`, { status: newStatus });
            setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="card">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-border">
                            <th className="p-4 font-semibold text-sm text-text-secondary">Title</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary">Resident</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary">Category</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary">Date</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary">Status</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(r => (
                            <tr key={r.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-medium text-sm">{r.title}</td>
                                <td className="p-4 text-sm">{r.user?.first_name} {r.user?.last_name}</td>
                                <td className="p-4 text-sm">{r.category?.name}</td>
                                <td className="p-4 text-sm">{new Date(r.created_at).toLocaleDateString()}</td>
                                <td className="p-4"><span className="badge badge-gray">{r.status}</span></td>
                                <td className="p-4">
                                    <select 
                                        className="text-sm border border-border rounded p-1"
                                        value={r.status}
                                        onChange={(e) => updateStatus(r.id, e.target.value)}
                                    >
                                        {['SUBMITTED', 'VERIFIED', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED'].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {reports.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-text-secondary">No reports found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
`,
    'src/pages/admin/Services.jsx': `import { useState, useEffect } from 'react';
import api from '../../lib/axios';

export default function AdminServices() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        api.get('/service-requests').then(res => setRequests(res.data));
    }, []);

    return (
        <div className="card">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-border">
                            <th className="p-4 font-semibold text-sm text-text-secondary">Service Type</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary">Resident</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary">Date</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(r => (
                            <tr key={r.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-medium text-sm">{r.service_type?.name}</td>
                                <td className="p-4 text-sm">{r.user?.first_name} {r.user?.last_name}</td>
                                <td className="p-4 text-sm">{new Date(r.created_at).toLocaleDateString()}</td>
                                <td className="p-4"><span className="badge badge-gray">{r.status}</span></td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr><td colSpan="4" className="p-8 text-center text-text-secondary">No service requests found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
`,
    'src/pages/admin/Emergencies.jsx': `import { useState, useEffect } from 'react';
import api from '../../lib/axios';

export default function AdminEmergencies() {
    const [emergencies, setEmergencies] = useState([]);

    useEffect(() => {
        api.get('/emergencies').then(res => setEmergencies(res.data));
    }, []);

    return (
        <div className="card">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-border">
                            <th className="p-4 font-semibold text-sm text-text-secondary">Type</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary">Contact Name</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary">Contact Phone</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary">Address</th>
                            <th className="p-4 font-semibold text-sm text-text-secondary">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emergencies.map(r => (
                            <tr key={r.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-medium text-sm text-danger">{r.category?.name}</td>
                                <td className="p-4 text-sm">{r.contact_name}</td>
                                <td className="p-4 text-sm">{r.contact_phone}</td>
                                <td className="p-4 text-sm">{r.address}</td>
                                <td className="p-4"><span className="badge badge-danger">{r.status}</span></td>
                            </tr>
                        ))}
                        {emergencies.length === 0 && (
                            <tr><td colSpan="5" className="p-8 text-center text-text-secondary">No emergencies found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(__dirname, filepath), content);
}
console.log("Scaffolded admin files successfully.");
