import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Building, ArrowRight } from 'lucide-react';

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0); // 0 = Splash, 1 = Onboarding

    useEffect(() => {
        // Show splash screen for 2.5 seconds, then go to onboarding
        if (step === 0) {
            const timer = setTimeout(() => {
                setStep(1);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleSkip = () => {
        // Navigate to login
        navigate('/login');
    };

    if (step === 0) {
        // Splash Screen
        return (
            <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/50 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
                    <div className="w-28 h-32 bg-white rounded-t-full rounded-b-[40px] flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.15)] mb-6 p-4 relative">
                        <Users size={32} className="text-blue-600 absolute top-4" />
                        <span className="text-6xl font-black text-blue-600 mt-6 tracking-tighter">B</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">BarangayLink</h1>
                    <p className="text-blue-100 font-medium tracking-wide">Maasahan. Malapit. Mabilis.</p>
                </div>
                
                {/* City silhouette placeholder at the bottom */}
                <div className="absolute bottom-0 left-0 w-full opacity-20">
                    <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path fill="#ffffff" fillOpacity="1" d="M0,256L48,250.7C96,245,192,235,288,208C384,181,480,139,576,144C672,149,768,203,864,213.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>
        );
    }

    // Onboarding Screen
    return (
        <div className="min-h-screen bg-white flex flex-col pt-12 pb-8 px-6 animate-in slide-in-from-right duration-500">
            <div className="flex justify-end mb-8">
                <button onClick={handleSkip} className="text-blue-600 font-bold text-sm tracking-wide">
                    Skip
                </button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Placeholder for illustration */}
                <div className="w-full max-w-[280px] aspect-square bg-slate-50 rounded-full mb-10 flex items-center justify-center shadow-inner border border-slate-100 relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 blur-xl scale-110"></div>
                    <Building size={100} className="text-blue-600 opacity-80" strokeWidth={1} />
                    <Users size={40} className="text-indigo-500 absolute bottom-12 right-12" />
                </div>
                
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                        Your Barangay,<br/>In Your Hands
                    </h2>
                    <p className="text-slate-500 font-medium text-[15px] leading-relaxed max-w-[280px] mx-auto">
                        Connect with your barangay officials, report issues, and access services quickly.
                    </p>
                </div>
            </div>
            
            <div className="mt-auto pt-8">
                <div className="flex justify-center gap-2 mb-8">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                </div>
                
                <button 
                    onClick={handleSkip}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
