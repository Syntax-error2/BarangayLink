const fs = require('fs');
const path = require('path');

const files = {
    'src/pages/resident/Emergency.jsx': `import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

export default function Emergency() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ category_id: '', contact_name: '', contact_phone: '', address: '', description: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data.emergencies || []));
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Geolocation placeholder
            const data = { ...form, latitude: 14.5547, longitude: 121.0244 };
            await api.post('/emergencies', data);
            alert('Emergency reported successfully! Responders have been notified.');
            navigate('/resident');
        } catch (err) {
            alert('Failed to report emergency');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4 min-h-screen pb-20">
            <h2 className="text-2xl font-bold text-danger mb-4">Report Emergency</h2>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="input-label">Emergency Type</label>
                    <select className="input-field" required value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                        <option value="">Select...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="input-label">Contact Name</label>
                    <input type="text" className="input-field" required value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})} />
                </div>
                <div>
                    <label className="input-label">Contact Phone</label>
                    <input type="tel" className="input-field" required value={form.contact_phone} onChange={e => setForm({...form, contact_phone: e.target.value})} />
                </div>
                <div>
                    <label className="input-label">Location / Address</label>
                    <textarea className="input-field" required value={form.address} onChange={e => setForm({...form, address: e.target.value})}></textarea>
                </div>
                <div>
                    <label className="input-label">Additional Details (Optional)</label>
                    <textarea className="input-field" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
                </div>
                <button type="submit" disabled={loading} className="btn btn-danger w-full text-lg py-3 mt-4">
                    {loading ? 'Submitting...' : 'CONFIRM EMERGENCY'}
                </button>
                <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary w-full mt-2">Cancel</button>
            </form>
        </div>
    );
}
`,

    'src/pages/resident/Reports.jsx': `import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ category_id: '', title: '', description: '', address: '' });
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [repRes, catRes] = await Promise.all([
            api.get('/reports'),
            api.get('/categories')
        ]);
        setReports(repRes.data);
        setCategories(catRes.data.reports || []);
    };

    const submitReport = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reports', form);
            setIsCreating(false);
            setForm({ category_id: '', title: '', description: '', address: '' });
            loadData();
        } catch (err) {
            alert('Failed to submit report');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4 min-h-screen pb-20">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Community Reports</h2>
                <button onClick={() => setIsCreating(!isCreating)} className="btn btn-primary">
                    {isCreating ? 'Cancel' : 'New Report'}
                </button>
            </div>

            {isCreating ? (
                <form onSubmit={submitReport} className="card p-4 space-y-4 mb-6">
                    <div>
                        <label className="input-label">Category</label>
                        <select className="input-field" required value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                            <option value="">Select...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="input-label">Title</label>
                        <input type="text" className="input-field" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="input-label">Location / Address</label>
                        <input type="text" className="input-field" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                    </div>
                    <div>
                        <label className="input-label">Description</label>
                        <textarea className="input-field" required value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Submit Report</button>
                </form>
            ) : (
                <div className="space-y-4">
                    {reports.length === 0 ? (
                        <div className="text-center p-8 text-text-secondary border border-dashed border-border rounded-xl">No reports found.</div>
                    ) : (
                        reports.map(r => (
                            <div key={r.id} className="card p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg">{r.title}</h3>
                                    <span className={\`badge \${r.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}\`}>{r.status}</span>
                                </div>
                                <p className="text-sm text-text-secondary mb-2">{r.category?.name} • {new Date(r.created_at).toLocaleDateString()}</p>
                                <p className="text-sm">{r.description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
`,

    'src/pages/resident/Services.jsx': `import { useState, useEffect } from 'react';
import api from '../../lib/axios';

export default function Services() {
    const [requests, setRequests] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [types, setTypes] = useState([]);
    const [form, setForm] = useState({ service_type_id: '', remarks: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [reqRes, catRes] = await Promise.all([
            api.get('/service-requests'),
            api.get('/categories')
        ]);
        setRequests(reqRes.data);
        setTypes(catRes.data.services || []);
    };

    const submitRequest = async (e) => {
        e.preventDefault();
        try {
            await api.post('/service-requests', form);
            setIsCreating(false);
            setForm({ service_type_id: '', remarks: '' });
            loadData();
        } catch (err) {
            alert('Failed to request service');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4 min-h-screen pb-20">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Service Requests</h2>
                <button onClick={() => setIsCreating(!isCreating)} className="btn btn-primary">
                    {isCreating ? 'Cancel' : 'New Request'}
                </button>
            </div>

            {isCreating ? (
                <form onSubmit={submitRequest} className="card p-4 space-y-4 mb-6">
                    <div>
                        <label className="input-label">Service Type</label>
                        <select className="input-field" required value={form.service_type_id} onChange={e => setForm({...form, service_type_id: e.target.value})}>
                            <option value="">Select...</option>
                            {types.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="input-label">Remarks / Purpose (Optional)</label>
                        <textarea className="input-field" value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Submit Request</button>
                </form>
            ) : (
                <div className="space-y-4">
                    {requests.length === 0 ? (
                        <div className="text-center p-8 text-text-secondary border border-dashed border-border rounded-xl">No requests found.</div>
                    ) : (
                        requests.map(r => (
                            <div key={r.id} className="card p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg">{r.service_type?.name}</h3>
                                    <span className={\`badge \${r.status === 'RELEASED' ? 'badge-success' : 'badge-warning'}\`}>{r.status}</span>
                                </div>
                                <p className="text-sm text-text-secondary mb-2">{new Date(r.created_at).toLocaleDateString()}</p>
                                {r.remarks && <p className="text-sm">{r.remarks}</p>}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
`,

    'src/pages/resident/Map.jsx': `import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import api from '../../lib/axios';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function GISMap() {
    const [reports, setReports] = useState([]);
    
    useEffect(() => {
        api.get('/reports').then(res => {
            // Filter out reports without coordinates
            setReports(res.data.filter(r => r.latitude && r.longitude));
        });
    }, []);

    const center = [14.5547, 121.0244]; // Makati center placeholder

    return (
        <div className="max-w-lg mx-auto min-h-screen pb-20 flex flex-col relative">
            <div className="p-4 z-10 bg-white/90 backdrop-blur border-b border-border absolute top-0 w-full shadow-sm">
                <h2 className="text-xl font-bold text-text-primary">Community Map</h2>
            </div>
            <div className="flex-1 w-full h-[calc(100vh-64px)] z-0">
                <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {reports.map(report => (
                        <Marker key={report.id} position={[report.latitude, report.longitude]}>
                            <Popup>
                                <div className="p-1">
                                    <h4 className="font-bold text-sm">{report.title}</h4>
                                    <p className="text-xs text-text-secondary">{report.category?.name}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(__dirname, filepath), content);
}
console.log("Scaffolded resident files successfully.");
