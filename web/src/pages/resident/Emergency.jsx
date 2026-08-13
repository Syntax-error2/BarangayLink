import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Send, Bot, User as UserIcon, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

export default function Chatbot() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [userData, setUserData] = useState({ reports: [], services: [] });
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'ai',
            content: location.state?.aiMessage || `Hello ${user?.first_name || 'Resident'}! I'm your BarangayLink AI Assistant. I can check the status of your reports, help you find services, or dispatch emergency protocols. What can I do for you today?`
        }
    ]);

    useEffect(() => {
        // Fetch user's data to give the AI context
        const fetchContext = async () => {
            try {
                const [repRes, srvRes] = await Promise.all([
                    api.get('/reports'),
                    api.get('/service-requests')
                ]);
                setUserData({
                    reports: repRes.data,
                    services: srvRes.data
                });
            } catch (err) {
                console.error("Failed to fetch context", err);
            }
        };
        fetchContext();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Simulated AI Engine with Context
    const generateAIResponse = (query) => {
        const q = query.toLowerCase();
        
        // Context-aware dynamic status checking
        if (q.includes('status') || q.includes('my report') || q.includes('my service') || q.includes('clearance')) {
            let response = "";
            
            const pendingReports = userData.reports.filter(r => r.status !== 'RESOLVED');
            const pendingServices = userData.services.filter(s => s.status !== 'COMPLETED');
            
            if (pendingReports.length === 0 && pendingServices.length === 0) {
                return "You currently have no active reports or pending service requests in the system. Everything looks great! 🌟";
            }
            
            if (pendingReports.length > 0) {
                response += "Here are your active reports:\n";
                pendingReports.forEach(r => {
                    response += `• **${r.category?.name || 'Report'}**: Status is currently **${r.status}**.\n`;
                });
            }
            
            if (pendingServices.length > 0) {
                response += "\nHere are your active service requests:\n";
                pendingServices.forEach(s => {
                    response += `• **${s.service_type?.name || 'Service'}**: Status is currently **${s.status}**.\n`;
                });
            }
            
            return response.trim();
        }

        if (q.includes('certificate') || q.includes('indigency') || q.includes('permit') || q.includes('clearance')) {
            return "📄 To get a barangay document (like a Clearance or Certificate of Indigency), you can go to the **'Home'** page and tap **Get Service**, or tap the Briefcase icon in the map. From there, select the document you need, fill in your details, and wait for a notification when it's ready!";
        }
        
        if (q.includes('report') || q.includes('issue') || q.includes('trash') || q.includes('garbage') || q.includes('noise') || q.includes('complain')) {
            return "📸 You can easily report community issues like uncollected garbage, noise complaints, or broken streetlights by tapping the **'Reports'** tab. We have a '1-Click Reports' feature that automatically tags your GPS location for faster resolution.";
        }

        if (q.includes('emergency') || q.includes('sos') || q.includes('help') || q.includes('fire') || q.includes('police') || q.includes('medical')) {
            return "🚨 **EMERGENCY ASSISTANCE:**\nIf this is a real emergency, please tap the **Red S.O.S Bell icon** at the bottom navigation bar immediately. This will instantly transmit your GPS location to our response team.\n\nHotlines:\n• Police: 166 / 117\n• Fire: 160\n• Ambulance: 911";
        }
        
        if (q.includes('id') || q.includes('barangay id') || q.includes('qr code')) {
            return "🪪 **Digital Barangay ID:**\nYou can find your official Digital Barangay ID by going to your **Profile** and tapping on 'View Barangay ID'. It has a QR code that officials can scan to verify your residency instantly!";
        }

        if (q.includes('barangaylink') || q.includes('what is this app') || q.includes('how to use')) {
            return "BarangayLink is your modern community management system! 📱\nYou can request services, submit reports, receive real-time announcements, and dispatch emergency S.O.S. alerts right from your phone. Our goal is to bring the barangay services straight to your fingertips.";
        }
        
        if (q.includes('thank')) {
            return "You're very welcome! Let me know if you need anything else. Have a great day ahead! 😊";
        }

        if (q.includes('hello') || q.includes('hi') || q.trim() === 'hi') {
            return `Hello there, ${user?.first_name}! 👋 What can I assist you with today?`;
        }
        
        return "I'm still learning and might not have the perfect answer for that yet. However, you can ask me about the status of your reports/services, how to get a barangay ID, or visit the Barangay Hall during office hours for direct assistance.";
    };

    const handleSend = (text = null) => {
        const messageText = text || input.trim();
        if (!messageText) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: messageText
        };

        setMessages(prev => [...prev, userMessage]);
        if (!text) setInput('');
        setIsTyping(true);

        // Simulate AI thinking delay
        setTimeout(() => {
            const response = generateAIResponse(userMessage.content);
            const aiMessage = {
                id: Date.now() + 1,
                role: 'ai',
                content: response
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1200);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestions = [
        "Check my request status",
        "How to get a Barangay ID?",
        "I need a barangay clearance",
        "Report an issue"
    ];

    return (
        <div className="max-w-lg mx-auto flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm px-5 py-4 flex items-center gap-3 z-30">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h2 className="font-black text-slate-900 text-lg leading-tight tracking-tight">AI Assistant</h2>
                    <p className="text-[11px] font-bold text-green-500 flex items-center gap-1 uppercase tracking-widest mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                        Online
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 pt-28 pb-40 hide-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                        {msg.role === 'ai' ? (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                                <Bot size={16} />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-1">
                                <UserIcon size={16} />
                            </div>
                        )}
                        <div className={`p-4 rounded-3xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200/60 shadow-sm text-slate-700 rounded-tl-sm'}`}>
                            <p className="text-[14px] leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                            <Bot size={16} />
                        </div>
                        <div className="px-5 py-4 rounded-3xl bg-white border border-slate-200/60 shadow-sm rounded-tl-sm flex items-center gap-1.5 h-12">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="fixed bottom-0 left-0 w-full bg-slate-50/95 backdrop-blur-xl z-40 pb-[env(safe-area-inset-bottom,0rem)]">
                {/* Suggestions */}
                {messages.length < 3 && !isTyping && (
                    <div className="flex overflow-x-auto hide-scrollbar gap-2 px-4 pb-2 pt-2">
                        {suggestions.map((suggestion, idx) => (
                            <button 
                                key={idx}
                                onClick={() => handleSend(suggestion)}
                                className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-bold text-slate-600 whitespace-nowrap shrink-0 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-95"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
                <div className="p-4 pt-2">
                    <div className="flex gap-2 bg-white p-1.5 rounded-full border border-slate-200/60 shadow-sm">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 text-slate-700 placeholder-slate-400 font-medium"
                        />
                        <button 
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isTyping}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${input.trim() && !isTyping ? 'bg-indigo-600 text-white shadow-md hover:scale-105 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                        >
                            <Send size={18} className="ml-1" />
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-slate-400 font-bold mt-3 uppercase tracking-widest pb-2">
                        AI Assistant can make mistakes
                    </p>
                </div>
            </div>
        </div>
    );
}
