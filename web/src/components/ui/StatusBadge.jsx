export default function StatusBadge({ status, className = '' }) {
    const s = status?.toLowerCase() || '';
    
    let colorClass = 'bg-slate-100 text-slate-700 border-slate-200'; // Default gray

    if (s.includes('resolve') || s.includes('complete') || s.includes('success')) {
        colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (s.includes('progress') || s.includes('active')) {
        colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
    } else if (s.includes('pending') || s.includes('review')) {
        colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
    } else if (s.includes('reject') || s.includes('error') || s.includes('cancel')) {
        colorClass = 'bg-red-50 text-red-700 border-red-200';
    }

    return (
        <span className={`inline-flex items-center font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${colorClass} ${className}`}>
            {status}
        </span>
    );
}
