import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResidentDashboard from './pages/resident/Dashboard';
import ResidentReports from './pages/resident/Reports';
import ResidentServices from './pages/resident/Services';
import ResidentMap from './pages/resident/Map';
import ResidentEmergency from './pages/resident/Emergency';
import ResidentSOS from './pages/resident/SOS';
import ResidentProfile from './pages/resident/Profile';
import ResidentLayout from './pages/resident/ResidentLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminReports from './pages/admin/Reports';
import AdminServices from './pages/admin/Services';
import AdminEmergencies from './pages/admin/Emergencies';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminSettings from './pages/admin/Settings';
import { NotificationProvider } from './context/NotificationContext';

import { ResidentNotificationProvider } from './context/ResidentNotificationContext';
import ResidentNotifications from './pages/resident/Notifications';

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
            <NotificationProvider>
                <ResidentNotificationProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<RootRedirect />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            
                            {/* Resident Routes */}
                            <Route path="/resident" element={<ProtectedRoute allowedRoles={['resident']}><ResidentLayout /></ProtectedRoute>}>
                                <Route index element={<ResidentDashboard />} />
                                <Route path="reports" element={<ResidentReports />} />
                                <Route path="services" element={<ResidentServices />} />
                                <Route path="map" element={<ResidentMap />} />
                                <Route path="emergency" element={<ResidentEmergency />} />
                                <Route path="sos" element={<ResidentSOS />} />
                                <Route path="profile" element={<ResidentProfile />} />
                                <Route path="notifications" element={<ResidentNotifications />} />
                            </Route>
                            
                            {/* Admin Routes */}
                            <Route path="/admin" element={<ProtectedRoute allowedRoles={['super-admin', 'barangay-admin', 'staff', 'responder']}><AdminLayout /></ProtectedRoute>}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="reports" element={<AdminReports />} />
                                <Route path="services" element={<AdminServices />} />
                                <Route path="emergencies" element={<AdminEmergencies />} />
                                <Route path="announcements" element={<AdminAnnouncements />} />
                                <Route path="settings" element={<AdminSettings />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </ResidentNotificationProvider>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;

