export default function Card({ children, className = '', onClick }) {
    const Component = onClick ? 'button' : 'div';
    return (
        <Component 
            onClick={onClick}
            className={`bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden ${onClick ? 'text-left active:scale-[0.98] transition-transform w-full hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]' : ''} ${className}`}
        >
            {children}
        </Component>
    );
}
