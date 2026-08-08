import React from 'react';

export default function PrintableDocument({ request }) {
    if (!request) return null;

    const { user, service_type, barangay, created_at } = request;
    const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const getDocumentTitle = (type) => {
        if (!type) return "CERTIFICATION";
        return type.toUpperCase();
    };

    const title = getDocumentTitle(service_type?.name);
    
    // Customize the text based on the document type
    const getBodyText = () => {
        const name = `${user?.first_name} ${user?.last_name}`.toUpperCase();
        const address = `${barangay?.name}, ${barangay?.city}, ${barangay?.province}`;
        const purpose = request.remarks || 'whatever legal purpose it may serve';
        
        if (title.includes('CLEARANCE')) {
            return (
                <div contentEditable suppressContentEditableWarning className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded-xl p-2 transition-all cursor-text text-justify" title="Click to edit document text">
                    <p className="leading-relaxed indent-12 mb-4"><strong>TO WHOM IT MAY CONCERN:</strong></p>
                    <p className="leading-relaxed indent-12 mb-4">This is to certify that <strong>{name}</strong>, of legal age, is a bona fide resident of Barangay {address}.</p>
                    <p className="leading-relaxed indent-12 mb-4">This further certifies that the above-named person has no derogatory record on file in this barangay as of this date.</p>
                    <p className="leading-relaxed indent-12">This clearance is being issued upon the request of the interested party for: <strong>{purpose}</strong>.</p>
                </div>
            );
        } else if (title.includes('INDIGENCY')) {
            return (
                <div contentEditable suppressContentEditableWarning className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded-xl p-2 transition-all cursor-text text-justify" title="Click to edit document text">
                    <p className="leading-relaxed indent-12 mb-4"><strong>TO WHOM IT MAY CONCERN:</strong></p>
                    <p className="leading-relaxed indent-12 mb-4">This is to certify that <strong>{name}</strong>, of legal age, is a bona fide resident of Barangay {address}.</p>
                    <p className="leading-relaxed indent-12 mb-4">This further certifies that the said resident belongs to an indigent family in this barangay whose combined income is not sufficient to support their basic needs.</p>
                    <p className="leading-relaxed indent-12">This certification is being issued upon the request of the interested party for: <strong>{purpose}</strong>.</p>
                </div>
            );
        } else {
            return (
                <div contentEditable suppressContentEditableWarning className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded-xl p-2 transition-all cursor-text text-justify" title="Click to edit document text">
                    <p className="leading-relaxed indent-12 mb-4"><strong>TO WHOM IT MAY CONCERN:</strong></p>
                    <p className="leading-relaxed indent-12 mb-4">This is to certify that <strong>{name}</strong> is a bona fide resident of Barangay {address}.</p>
                    <p className="leading-relaxed indent-12">This certification is being issued upon the request of the interested party for: <strong>{purpose}</strong>.</p>
                </div>
            );
        }
    };

    return (
        <div className="bg-white text-black w-full h-full print:bg-white relative overflow-hidden" style={{ padding: '1in' }}>
            {/* Watermark Logo */}
            {barangay?.logo_path && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 print:opacity-20 z-0" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                    <div className="w-16 h-16 rounded-full border border-gray-200 p-1 flex-shrink-0">
                        <img 
                        src={`https://lavender-clam-996039.hostingersite.com/${barangay.logo_path}`} 
                        alt="Barangay Logo" 
                        className="w-full h-full object-contain rounded-full"
                        />
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-12 relative z-10">
                <p className="text-sm uppercase tracking-wide">Republic of the Philippines</p>
                <p className="text-sm uppercase tracking-wide">Province of {barangay?.province || 'Negros Occidental'}</p>
                <p className="text-sm uppercase tracking-wide">Municipality of {barangay?.city || 'Binalbagan'}</p>
                <h1 className="text-xl font-bold mt-2 uppercase">OFFICE OF THE PUNONG BARANGAY</h1>
                <h2 className="text-lg font-semibold uppercase">BARANGAY {barangay?.name || 'SANTO ROSARIO'}</h2>
            </div>

            {/* Title */}
            <div className="text-center my-16 relative z-10">
                <h2 className="text-3xl font-black uppercase tracking-widest underline underline-offset-8">{title}</h2>
            </div>

            {/* Body */}
            <div className="text-lg space-y-6 max-w-4xl mx-auto px-8 relative z-10">
                {getBodyText()}

                <p className="leading-relaxed text-justify mt-8">
                    Issued this <strong>{date}</strong> at Barangay {barangay?.name}, {barangay?.city}, {barangay?.province}, Philippines.
                </p>
            </div>

            {/* Signature Area */}
            <div className="mt-32 flex justify-end px-8 relative z-10">
                <div className="text-center w-64">
                    <div className="border-b border-black mb-2 h-8"></div>
                    <p className="font-bold uppercase text-lg">Hon. Juan Dela Cruz</p>
                    <p className="text-sm">Punong Barangay</p>
                </div>
            </div>

            {/* Footer Note */}
            <div className="fixed bottom-10 left-0 right-0 text-center text-xs text-gray-500 font-mono print:block hidden relative z-10">
                Generated by BarangayLink System - {request.id} - {new Date().toISOString()}
            </div>
        </div>
    );
}
