import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import AdminMap from './pages/admin/Map';
import AdminAnalytics from './pages/admin/Analytics';
import AdminResidents from './pages/admin/Residents';
import AdminUsers from './pages/admin/Users';
import AdminMessages from './pages/admin/Messages';
import AdminEvents from './pages/admin/Events';
import AdminBroadcast from './pages/admin/Broadcast';
import AdminLogs from './pages/admin/Logs';
import AdminDocuments from './pages/admin/Documents';
import { NotificationProvider } from './context/NotificationContext';

import { ResidentNotificationProvider } from './context/ResidentNotificationContext';
import ResidentNotifications from './pages/resident/Notifications';
import Onboarding from './pages/auth/Onboarding';

const isApp = () => {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || !!window.Capacitor;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to={isApp() ? "/onboarding" : "/login"} />;
    if (allowedRoles && !allowedRoles.includes(user.role.slug)) return <Navigate to="/" />;
    return children;
};

const RootRedirect = () => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to={isApp() ? "/onboarding" : "/login"} />;
    return user.role.slug === 'resident' ? <Navigate to="/resident" /> : <Navigate to="/admin" />;
};

function App() {
    const Router = isApp() ? HashRouter : BrowserRouter;
    
    return (
        <AuthProvider>
            <NotificationProvider>
                <ResidentNotificationProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<RootRedirect />} />
                            <Route path="/onboarding" element={<Onboarding />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            
                            {/* Resident Routes */}
                            <Route path="/resident/emergency" element={<ProtectedRoute allowedRoles={['resident']}><ResidentEmergency /></ProtectedRoute>} />
                            <Route path="/resident" element={<ProtectedRoute allowedRoles={['resident']}><ResidentLayout /></ProtectedRoute>}>
                                <Route index element={<ResidentDashboard />} />
                                <Route path="reports" element={<ResidentReports />} />
                                <Route path="services" element={<ResidentServices />} />
                                <Route path="map" element={<ResidentMap />} />
                                <Route path="sos" element={<ResidentSOS />} />
                                <Route path="profile" element={<ResidentProfile />} />
                                <Route path="notifications" element={<ResidentNotifications />} />
                            </Route>
                            <Route path="/admin" element={<ProtectedRoute allowedRoles={['super-admin', 'barangay-admin', 'staff', 'responder']}><AdminLayout /></ProtectedRoute>}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="map" element={<AdminMap />} />
                                <Route path="analytics" element={<AdminAnalytics />} />
                                <Route path="reports" element={<AdminReports />} />
                                <Route path="services" element={<AdminServices />} />
                                <Route path="residents" element={<AdminResidents />} />
                                <Route path="users" element={<AdminUsers />} />
                                <Route path="emergencies" element={<AdminEmergencies />} />
                                <Route path="announcements" element={<AdminAnnouncements />} />
                                <Route path="broadcast" element={<AdminBroadcast />} />
                                <Route path="messages" element={<AdminMessages />} />
                                <Route path="events" element={<AdminEvents />} />
                                <Route path="documents" element={<AdminDocuments />} />
                                <Route path="settings" element={<AdminSettings />} />
                                <Route path="logs" element={<AdminLogs />} />
                            </Route>
                        </Routes>
                    </Router>
                </ResidentNotificationProvider>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;

