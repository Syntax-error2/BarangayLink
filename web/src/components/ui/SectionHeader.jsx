export default function SectionHeader({ title, subtitle, action, className = '' }) {
    return (
        <div className={`flex justify-between items-end mb-4 ${className}`}>
            <div>
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">{title}</h3>
                {subtitle && <p className="text-xs font-medium text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            {action && (
                <div className="shrink-0 ml-4">
                    {action}
                </div>
            )}
        </div>
    );
}
