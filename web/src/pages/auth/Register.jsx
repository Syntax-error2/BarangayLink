import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import { User, Mail, MapPin, Lock, Eye, EyeOff, ChevronDown, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        barangay_id: ''
    });
    
    const [barangays, setBarangays] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/barangays')
            .then(res => setBarangays(res.data))
            .catch(err => console.error("Failed to fetch barangays", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear specific error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        // Clear main error if exists
        if (errors.main) {
            setErrors(prev => ({ ...prev, main: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email address is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email required';
        
        if (!formData.barangay_id) newErrors.barangay_id = 'Barangay selection required';
        
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Password confirmation must match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculatePasswordStrength = (password) => {
        if (!password) return { label: '', color: 'bg-slate-200' };
        if (password.length < 6) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/3' };
        if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return { label: 'Medium', color: 'bg-amber-400', width: 'w-2/3' };
        }
        return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await api.post('/register', {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
                barangay_id: formData.barangay_id
            });
            login(res.data.user, res.data.token);
            navigate('/resident');
        } catch (err) {
            setErrors({ main: err.response?.data?.message || 'Registration failed.' });
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = calculatePasswordStrength(formData.password);

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
                    Join BarangayLink
                </h2>
                <p className="text-center text-sm font-medium text-slate-500 mb-8">
                    Create an account to connect with your community
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
                        
                        <div className="flex flex-col sm:flex-row gap-5 sm:gap-4">
                            <div className="w-full">
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">First Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text" name="first_name" 
                                        className={`w-full rounded-2xl bg-white border ${errors.first_name ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm placeholder-slate-400`}
                                        placeholder="Juan"
                                        value={formData.first_name} onChange={handleChange}
                                    />
                                </div>
                                {errors.first_name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.first_name}</p>}
                            </div>
                            <div className="w-full">
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">Last Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text" name="last_name" 
                                        className={`w-full rounded-2xl bg-white border ${errors.last_name ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm placeholder-slate-400`}
                                        placeholder="Dela Cruz"
                                        value={formData.last_name} onChange={handleChange}
                                    />
                                </div>
                                {errors.last_name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.last_name}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email" name="email" 
                                    className={`w-full rounded-2xl bg-white border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm placeholder-slate-400`}
                                    placeholder="name@example.com"
                                    value={formData.email} onChange={handleChange}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">Select Your Barangay</label>
                            
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <MapPin className="h-5 w-5 text-slate-400" />
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={() => setErrors(prev => ({...prev, dropdownOpen: !errors.dropdownOpen}))}
                                    className={`w-full text-left rounded-2xl bg-white border ${errors.barangay_id ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} pl-11 pr-10 py-3.5 text-sm ${formData.barangay_id ? 'text-slate-900' : 'text-slate-400'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`}
                                >
                                    {formData.barangay_id 
                                        ? barangays.find(b => b.id === parseInt(formData.barangay_id))?.name || "Choose a barangay..."
                                        : "Choose a barangay..."
                                    }
                                </button>
                                
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${errors.dropdownOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {/* Custom Dropdown Menu */}
                            {errors.dropdownOpen && (
                                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto">
                                    {barangays.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-slate-500">Loading barangays...</div>
                                    ) : (
                                        <ul className="py-1">
                                            {barangays.map(b => (
                                                <li key={b.id}>
                                                    <button
                                                        type="button"
                                                        className={`w-full text-left px-5 py-3 text-sm hover:bg-blue-50 transition-colors ${formData.barangay_id == b.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'}`}
                                                        onClick={() => {
                                                            handleChange({ target: { name: 'barangay_id', value: b.id.toString() }});
                                                            setErrors(prev => ({...prev, dropdownOpen: false}));
                                                        }}
                                                    >
                                                        {b.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {errors.barangay_id && <p className="text-xs text-red-500 mt-1 ml-1">{errors.barangay_id}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'} name="password" 
                                    className={`w-full rounded-2xl bg-white border ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} pl-11 pr-12 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm placeholder-slate-400`}
                                    placeholder="••••••••"
                                    value={formData.password} onChange={handleChange}
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
                            
                            {/* Password Strength Indicator */}
                            {formData.password && !errors.password && (
                                <div className="mt-2 ml-1 flex items-center justify-between">
                                    <div className="w-1/2 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`}></div>
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{passwordStrength.label}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'} name="password_confirmation" 
                                    className={`w-full rounded-2xl bg-white border ${errors.password_confirmation ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} pl-11 pr-12 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm placeholder-slate-400`}
                                    placeholder="••••••••"
                                    value={formData.password_confirmation} onChange={handleChange}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password_confirmation && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password_confirmation}</p>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full flex justify-center items-center py-3.5 px-4 rounded-2xl shadow-[0_4px_14px_rgba(37,99,235,0.2)] text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin mr-2 h-4 w-4 text-white" />
                            ) : null}
                            {loading ? 'Creating account...' : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                Sign In Instead
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
