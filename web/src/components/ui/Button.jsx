export default function Button({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    loading = false, 
    disabled = false,
    onClick,
    ...props 
}) {
    const baseStyle = "inline-flex items-center justify-center font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none";
    
    const variants = {
        primary: "bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-blue-700",
        secondary: "bg-blue-50 text-blue-700 hover:bg-blue-100",
        danger: "bg-red-600 text-white shadow-[0_4px_14px_rgba(220,38,38,0.3)] hover:bg-red-700",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100"
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-6 py-4 text-base"
    };

    return (
        <button 
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            {children}
        </button>
    );
}
