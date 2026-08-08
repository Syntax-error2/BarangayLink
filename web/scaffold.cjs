const fs = require('fs');
const path = require('path');

const dirs = [
    'src/components/ui',
    'src/components/layout',
    'src/pages/auth',
    'src/pages/resident',
    'src/pages/admin',
    'src/lib',
    'src/context',
    'src/hooks',
];

dirs.forEach(dir => {
    fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

const files = {
    'src/lib/axios.js': `import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
});

export default api;
`,

    'src/context/AuthContext.jsx': `import { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/user').then(res => {
                setUser(res.data);
            }).catch(() => {
                localStorage.removeItem('token');
            }).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
`,

    'src/App.jsx': `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import ResidentDashboard from './pages/resident/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role.slug)) return <Navigate to="/" />;
    return children;
};

const RootRedirect = () => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    return user.role.slug === 'resident' ? <Navigate to="/resident" /> : <Navigate to="/admin" />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<RootRedirect />} />
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/resident" element={
                        <ProtectedRoute allowedRoles={['resident']}>
                            <ResidentDashboard />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['super-admin', 'barangay-admin', 'staff', 'responder']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
`,

    'src/pages/auth/Login.jsx': `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/login', { email, password });
            login(res.data.user, res.data.token);
            if (res.data.user.role.slug === 'resident') {
                navigate('/resident');
            } else {
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-text-primary">
                    Sign in to BarangayLink
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="card px-4 py-8 sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="text-danger text-sm text-center">{error}</div>}
                        <div>
                            <label className="input-label">Email address</label>
                            <input
                                type="email" required className="input-field"
                                value={email} onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="input-label">Password</label>
                            <input
                                type="password" required className="input-field"
                                value={password} onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary w-full">
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
`,

    'src/pages/resident/Dashboard.jsx': `import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function ResidentDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="bg-primary text-white p-4 shadow-sm">
                <div className="flex justify-between items-center max-w-lg mx-auto">
                    <h1 className="font-bold text-xl">BarangayLink</h1>
                    <button onClick={logout} className="p-2"><LogOut size={20} /></button>
                </div>
            </header>
            
            <main className="max-w-lg mx-auto p-4 mt-4 space-y-6">
                <section>
                    <h2 className="text-2xl font-bold text-text-primary">Welcome, {user?.first_name}!</h2>
                    <p className="text-text-secondary">What do you need help with today?</p>
                </section>
                
                <section className="card p-4 border-l-4 border-danger">
                    <h3 className="font-bold text-lg text-danger mb-2">Emergency Action</h3>
                    <p className="text-sm text-text-secondary mb-4">Report an emergency that requires immediate response.</p>
                    <button className="btn btn-danger w-full">Report Emergency</button>
                </section>

                <div className="grid grid-cols-2 gap-4">
                    <button className="card p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-primary">
                        <span className="font-medium text-sm">Report Issue</span>
                    </button>
                    <button className="card p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-primary">
                        <span className="font-medium text-sm">Request Service</span>
                    </button>
                </div>
            </main>
            
            <nav className="fixed bottom-0 w-full bg-white border-t border-border sm:max-w-lg sm:left-1/2 sm:-translate-x-1/2">
                <div className="flex justify-around items-center h-16">
                    <button className="text-primary flex flex-col items-center text-xs font-medium">
                        Home
                    </button>
                    <button className="text-text-secondary flex flex-col items-center text-xs font-medium">
                        Reports
                    </button>
                    <button className="text-text-secondary flex flex-col items-center text-xs font-medium">
                        Map
                    </button>
                    <button className="text-text-secondary flex flex-col items-center text-xs font-medium">
                        Profile
                    </button>
                </div>
            </nav>
        </div>
    );
}
`,

    'src/pages/admin/Dashboard.jsx': `import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function AdminDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen flex bg-background">
            <aside className="w-64 bg-white border-r border-border hidden md:flex flex-col">
                <div className="p-4 border-b border-border">
                    <h1 className="font-bold text-xl text-primary">BarangayLink</h1>
                    <span className="text-xs text-text-secondary">Admin Portal</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">Dashboard</button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-text-secondary hover:bg-gray-50">Reports</button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-text-secondary hover:bg-gray-50">Services</button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-text-secondary hover:bg-gray-50">Emergencies</button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-text-secondary hover:bg-gray-50">Map</button>
                </nav>
            </aside>
            
            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
                    <h2 className="font-semibold text-text-primary">Dashboard Overview</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-text-secondary">{user?.first_name} {user?.last_name} ({user?.role.name})</span>
                        <button onClick={logout} className="p-2 text-text-secondary hover:text-danger"><LogOut size={20} /></button>
                    </div>
                </header>
                
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="card p-6">
                            <h3 className="text-sm font-medium text-text-secondary mb-1">Total Reports</h3>
                            <p className="text-3xl font-bold text-text-primary">24</p>
                        </div>
                        <div className="card p-6">
                            <h3 className="text-sm font-medium text-text-secondary mb-1">Active Emergencies</h3>
                            <p className="text-3xl font-bold text-danger">1</p>
                        </div>
                        <div className="card p-6">
                            <h3 className="text-sm font-medium text-text-secondary mb-1">Pending Services</h3>
                            <p className="text-3xl font-bold text-warning">8</p>
                        </div>
                        <div className="card p-6">
                            <h3 className="text-sm font-medium text-text-secondary mb-1">Resolved</h3>
                            <p className="text-3xl font-bold text-success">15</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(__dirname, filepath), content);
}

console.log("Scaffolded initial frontend files successfully.");
