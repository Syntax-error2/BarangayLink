import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Plus, File, Image as ImageIcon, Search } from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminDocuments() {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            setDocuments(response.data);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);

        try {
            await api.post('/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchDocuments();
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload document');
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;
        
        try {
            await api.delete(`/documents/` + id);
            setDocuments(docs => docs.filter(d => d.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const getFileIcon = (type) => {
        const t = type?.toLowerCase() || '';
        if (['png', 'jpg', 'jpeg', 'gif'].includes(t)) return <ImageIcon size={24} className="text-blue-500" />;
        if (['pdf'].includes(t)) return <FileText size={24} className="text-red-500" />;
        return <File size={24} className="text-slate-500" />;
    };

    const filteredDocs = documents.filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Document Center</h1>
                    <p className="text-slate-500">Manage official barangay documents and forms</p>
                </div>
                
                <div className="relative">
                    <input 
                        type="file" 
                        id="file-upload" 
                        className="hidden" 
                        onChange={handleFileUpload} 
                        disabled={uploading} 
                    />
                    <label 
                        htmlFor="file-upload" 
                        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium cursor-pointer hover:bg-blue-700 transition-colors shadow-sm ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Plus size={20} />
                        )}
                        {uploading ? 'Uploading...' : 'Upload Document'}
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search documents..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-500">Loading documents...</div>
                ) : filteredDocs.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} />
                        </div>
                        <h3 className="font-semibold text-slate-900">No documents found</h3>
                        <p className="text-slate-500 text-sm mt-1">Upload a document to get started</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="p-4 pl-6 font-medium">Document Name</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Size</th>
                                <th className="p-4 font-medium">Uploaded By</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 pr-6 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredDocs.map(doc => (
                                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                {getFileIcon(doc.file_type)}
                                            </div>
                                            <div className="font-medium text-slate-900 truncate max-w-xs" title={doc.title}>
                                                {doc.title}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500 uppercase font-medium text-xs">{doc.file_type || 'FILE'}</td>
                                    <td className="p-4 text-slate-500">{doc.file_size}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                {doc.uploader?.first_name?.charAt(0) || 'U'}
                                            </div>
                                            <span className="text-slate-600">{doc.uploader?.first_name} {doc.uploader?.last_name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500">
                                        {new Date(doc.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <a 
                                                href={import.meta.env.VITE_API_URL.replace('/api', '') + doc.file_path} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                download
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Download"
                                            >
                                                <Download size={18} />
                                            </a>
                                            <button 
                                                onClick={() => handleDelete(doc.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
