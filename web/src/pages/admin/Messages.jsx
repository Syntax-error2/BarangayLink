import { useState } from 'react';
import { 
    Search, MessageSquare, Send, MoreVertical, 
    Phone, Video, Info, Paperclip, Smile
} from 'lucide-react';

export default function Messages() {
    const [activeChat, setActiveChat] = useState(1);
    const [message, setMessage] = useState('');

    const chats = [
        { id: 1, name: 'Juan Dela Cruz', lastMessage: 'Thank you for the update on my clearance.', time: '10:42 AM', unread: 2, avatar: 'J', online: true },
        { id: 2, name: 'Maria Santos', lastMessage: 'Is the health center open today?', time: 'Yesterday', unread: 0, avatar: 'M', online: false },
        { id: 3, name: 'Pedro Penduko', lastMessage: 'I sent the requirements.', time: 'Yesterday', unread: 0, avatar: 'P', online: true },
        { id: 4, name: 'Brgy Responders Group', lastMessage: 'Team A is deployed.', time: 'Tuesday', unread: 0, avatar: 'B', isGroup: true, online: true },
        { id: 5, name: 'Ana Rizal', lastMessage: 'Noted, thank you!', time: 'Monday', unread: 0, avatar: 'A', online: false },
    ];

    const messages = [
        { id: 1, sender: 'Juan Dela Cruz', text: 'Good morning Admin! I would like to ask about my barangay clearance request.', time: '10:30 AM', isMe: false },
        { id: 2, sender: 'Admin', text: 'Good morning Juan. Let me check the status of your request.', time: '10:32 AM', isMe: true },
        { id: 3, sender: 'Admin', text: 'It has been approved. You can pick it up this afternoon at the barangay hall.', time: '10:35 AM', isMe: true },
        { id: 4, sender: 'Juan Dela Cruz', text: 'That is great news! What time is the cut-off?', time: '10:40 AM', isMe: false },
        { id: 5, sender: 'Juan Dela Cruz', text: 'Thank you for the update on my clearance.', time: '10:42 AM', isMe: false },
    ];

    const activeUser = chats.find(c => c.id === activeChat);

    return (
        <div className="h-[calc(100vh-140px)] animate-fade-in flex flex-col sm:flex-row gap-6">
            {/* Sidebar List */}
            <div className="w-full sm:w-80 flex flex-col bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden shrink-0">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                        <MessageSquare className="text-blue-600" size={20} />
                        Messages
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search messages..." 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {chats.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => setActiveChat(chat.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors mb-1 ${activeChat === chat.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                        >
                            <div className="relative">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${chat.isGroup ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                    {chat.avatar}
                                </div>
                                {chat.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className={`text-sm font-bold truncate ${activeChat === chat.id ? 'text-blue-900' : 'text-slate-900'}`}>{chat.name}</h3>
                                    <span className={`text-[10px] whitespace-nowrap ${chat.unread > 0 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-xs truncate ${chat.unread > 0 ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>{chat.lastMessage}</p>
                                    {chat.unread > 0 && (
                                        <span className="bg-blue-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shrink-0">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden relative">
                {activeUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm ${activeUser.isGroup ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {activeUser.avatar}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">{activeUser.name}</h3>
                                    <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Phone size={18} /></button>
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Video size={18} /></button>
                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"><Info size={18} /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-slate-50/50">
                            <div className="text-center mb-6">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">Today</span>
                            </div>
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-end gap-2 max-w-[70%]">
                                        {!msg.isMe && (
                                            <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 mb-1">
                                                {activeUser.avatar}
                                            </div>
                                        )}
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 mx-8">{msg.time}</span>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                                    <Paperclip size={20} />
                                </button>
                                <div className="flex-1 relative">
                                    <input 
                                        type="text"
                                        placeholder="Type your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <Smile size={18} />
                                    </button>
                                </div>
                                <button 
                                    className={`p-3 rounded-xl transition-colors ${message.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                >
                                    <Send size={20} className={message.trim() ? 'ml-1' : ''} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <MessageSquare size={48} className="mb-4 text-slate-300" strokeWidth={1.5} />
                        <p className="text-base font-medium text-slate-600">No conversation selected</p>
                        <p className="text-sm">Select a chat from the sidebar to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
