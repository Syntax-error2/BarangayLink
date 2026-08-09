import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Email address is required';
        if (!password) newErrors.password = 'Password is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

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
            setErrors({ main: err.response?.data?.message || 'Invalid email or password.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans pb-24">
            
            {/* Subtle Premium Background Tint */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-50/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex items-center justify-center p-[2px] border border-slate-100">
                        <img src="/logo.jpg" alt="BarangayLink Logo" className="w-full h-full object-cover rounded-[14px]" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 mb-2">
                    BarangayLink
                </h2>
                <p className="text-center text-sm font-medium text-slate-500 mb-8">
                    Secure access to your local government
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 w-full">
                <div className="bg-white py-8 px-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-slate-100 sm:px-10">
                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        {errors.main && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center border border-red-100">
                                {errors.main}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email" required 
                                    className={`w-full rounded-2xl bg-white border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm placeholder-slate-400`}
                                    placeholder="name@example.com"
                                    value={email} onChange={e => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                                        if (errors.main) setErrors(prev => ({ ...prev, main: '' }));
                                    }}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-1.5 px-1">
                                <label className="block text-xs font-semibold text-slate-700">Password</label>
                                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'} required 
                                    className={`w-full rounded-2xl bg-white border ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} pl-11 pr-12 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm placeholder-slate-400`}
                                    placeholder="••••••••"
                                    value={password} onChange={e => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                                        if (errors.main) setErrors(prev => ({ ...prev, main: '' }));
                                    }}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full flex justify-center items-center py-3.5 px-4 rounded-2xl shadow-[0_4px_14px_rgba(37,99,235,0.2)] text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin mr-2 h-4 w-4 text-white" />
                            ) : null}
                            {loading ? 'Authenticating...' : (
                                <>
                                    Sign In
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-sm text-slate-500">
                            New to BarangayLink?{' '}
                            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                Create an Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
