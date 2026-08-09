import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Header({ title, rightAction, onBack }) {
    const navigate = useNavigate();

    return (
        <div className="sticky top-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between min-h-14 px-4 pt-[calc(env(safe-area-inset-top)+8px)] pb-3">
            <div className="flex items-center gap-3">
                <button 
                    onClick={onBack || (() => navigate(-1))}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors text-slate-700"
                >
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <h1 className="font-bold text-[17px] tracking-tight text-slate-900">{title}</h1>
            </div>
            {rightAction && (
                <div>{rightAction}</div>
            )}
        </div>
    );
}
