import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useMessaging } from "../../hooks/useMessaging";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Send, Search, MessageSquare, MoreVertical, CheckCheck, Clock, Store, ShieldAlert, Ban } from "lucide-react";

const MessagingPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeConversationId = searchParams.get("conversation");
    const { user } = useAuth();
    
    const {
        conversations,
        messages,
        isLoading,
        fetchConversations,
        fetchMessages,
        sendMessage,
        markAsRead
    } = useMessaging();

    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(() => {
            fetchConversations();
        }, 10000);
        return () => clearInterval(interval);
    }, [fetchConversations]);

    useEffect(() => {
        if (activeConversationId) {
            fetchMessages(activeConversationId);
            markAsRead(activeConversationId);
            const interval = setInterval(() => {
                fetchMessages(activeConversationId);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [activeConversationId, fetchMessages, markAsRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversationId) return;
        
        try {
            await sendMessage(activeConversationId, newMessage);
            setNewMessage("");
            fetchConversations();
        } catch (error) {
            console.error("Failed to send", error);
        }
    };

    const handleSelectConversation = (id) => {
        setSearchParams({ conversation: id });
    };

    const filteredConversations = conversations.filter(conv => {
        const otherParticipant = conv.participants.find(p => p.id !== user?.id) || conv.participants[0];
        return otherParticipant?.username.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const activeConversation = conversations.find(c => c.id.toString() === activeConversationId);
    const activeParticipant = activeConversation?.participants.find(p => p.id !== user?.id);

    return (
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-0 h-[calc(100vh-65px)] font-sans">
            <div className="flex h-full gap-6 relative pb-4">
                
                {/* Conversations Sidebar */}
                <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col h-full bg-surface-primary rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-primary overflow-hidden flex-shrink-0">
                    <div className="p-5 border-b border-border-primary bg-surface-secondary/50 backdrop-blur-md">
                        <h2 className="text-xl font-display font-bold text-text-primary mb-4 flex items-center justify-between">
                            Messages
                            <span className="bg-accent-primary/10 text-accent-primary text-xs py-1 px-2.5 rounded-full font-medium">
                                {conversations.length} Active
                            </span>
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                            <Input
                                placeholder="Search conversations..."
                                className="pl-9 bg-background-primary border-border-primary rounded-md focus:ring-accent-primary/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {filteredConversations.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-text-tertiary p-6 text-center space-y-3">
                                <MessageSquare size={32} className="opacity-20" />
                                <p className="text-sm">No conversations found.</p>
                            </div>
                        ) : (
                            <div className="p-2 space-y-1">
                                {filteredConversations.map(conv => {
                                    const otherParticipant = conv.participants.find(p => p.id !== user?.id) || conv.participants[0];
                                    const isActive = conv.id.toString() === activeConversationId;
                                    const hasUnread = conv.unread_count > 0;
                                    
                                    return (
                                        <div 
                                            key={conv.id} 
                                            onClick={() => handleSelectConversation(conv.id)}
                                            className={`p-3 rounded-md cursor-pointer transition-all duration-200 group flex items-start gap-3 relative ${isActive ? 'bg-accent-primary text-text-inverse shadow-md shadow-accent-primary/20' : 'hover:bg-surface-hover'}`}
                                        >
                                            <div className="relative">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-gray-100 to-gray-200 text-text-secondary group-hover:from-accent-primary/10 group-hover:to-accent-primary/5 group-hover:text-accent-primary'}`}>
                                                    {otherParticipant?.username?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                {/* Online indicator mock */}
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface-primary"></div>
                                            </div>
                                            
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <span className={`font-semibold truncate ${isActive ? 'text-white' : 'text-text-primary'}`}>
                                                        {otherParticipant?.username}
                                                    </span>
                                                    {conv.last_message && (
                                                        <span className={`text-[10px] whitespace-nowrap ${isActive ? 'text-blue-100' : 'text-text-tertiary'}`}>
                                                            {new Date(conv.last_message.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={`text-sm truncate ${isActive ? 'text-blue-50' : (hasUnread ? 'text-text-primary font-medium' : 'text-text-secondary')}`}>
                                                        {conv.last_message?.content || "Say hello!"}
                                                    </p>
                                                    {hasUnread && !isActive && (
                                                        <span className="flex-shrink-0 bg-accent-primary text-white text-[10px] font-bold px-1.5 min-w-[20px] h-5 rounded-full flex items-center justify-center animate-pulse">
                                                            {conv.unread_count}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Thread Area */}
                <div className="hidden md:flex flex-1 flex-col h-full bg-surface-primary rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-primary overflow-hidden relative">
                    {activeConversationId ? (
                        <>
                            {/* Thread Header */}
                            <div className="p-4 px-6 border-b border-border-primary bg-surface-primary/80 backdrop-blur-md flex justify-between items-center relative z-30">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-hover/10 text-accent-primary flex items-center justify-center font-bold text-lg shadow-sm">
                                        {activeParticipant?.username?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-primary text-lg leading-tight">
                                            {activeParticipant?.username || 'Conversation'}
                                        </h3>
                                        <span className="text-xs text-green-500 font-medium flex items-center gap-1 mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                                            Online
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 relative" ref={menuRef}>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-secondary"
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    >
                                        <MoreVertical size={20} />
                                    </Button>
                                    
                                    {isMenuOpen && (
                                        <div className="absolute top-full right-0 mt-1 w-48 bg-surface-primary border border-border-primary rounded-md shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            {activeParticipant?.store_slug && (
                                                <Link 
                                                    to={`/store/${activeParticipant.store_slug}`}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary transition-colors"
                                                >
                                                    <Store size={16} className="text-text-secondary" />
                                                    View Storefront
                                                </Link>
                                            )}
                                            <button 
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary transition-colors text-left"
                                                onClick={() => {
                                                    alert("Report functionality coming soon!");
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                <ShieldAlert size={16} className="text-text-secondary" />
                                                Report User
                                            </button>
                                            <button 
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors text-left"
                                                onClick={() => {
                                                    alert("Block functionality coming soon!");
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                <Ban size={16} className="text-error" />
                                                Block User
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed relative">
                                <div className="absolute inset-0 bg-background-secondary/40 pointer-events-none"></div>
                                <div className="relative z-10 space-y-6">
                                    {messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 pt-12">
                                            <div className="w-20 h-20 rounded-full bg-accent-primary/10 flex items-center justify-center">
                                                <MessageSquare size={32} className="text-accent-primary" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-text-primary">Start the conversation</h4>
                                                <p className="text-text-secondary mt-1 max-w-sm">
                                                    Send a message to {activeParticipant?.username} to begin discussing the project.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        messages.map((msg, idx) => {
                                            const isMine = msg.sender.id === user?.id;
                                            const showAvatar = idx === 0 || messages[idx - 1].sender.id !== msg.sender.id;
                                            
                                            return (
                                                <div key={idx} className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                    {!isMine && showAvatar && (
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-text-secondary flex items-center justify-center text-xs font-bold mb-1 shrink-0 shadow-sm">
                                                            {msg.sender?.username?.charAt(0)?.toUpperCase() || '?'}
                                                        </div>
                                                    )}
                                                    {!isMine && !showAvatar && <div className="w-8 shrink-0"></div>}
                                                    
                                                    <div className={`group relative max-w-[75%] lg:max-w-[65%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                                        <div 
                                                            className={`px-5 py-3 shadow-sm text-[15px] leading-relaxed break-words
                                                                ${isMine 
                                                                    ? 'bg-accent-primary text-white rounded-md' 
                                                                    : 'bg-white border border-border-primary text-text-primary rounded-md'
                                                                }`}
                                                        >
                                                            {msg.content}
                                                        </div>
                                                        <div className={`flex items-center gap-1 mt-1 text-[11px] font-medium text-text-tertiary px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                                                            <Clock size={10} />
                                                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                            {isMine && <CheckCheck size={12} className="text-accent-primary ml-0.5" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-surface-primary border-t border-border-primary z-10">
                                <form onSubmit={handleSendMessage} className="flex gap-3 items-end max-w-4xl mx-auto">
                                    <div className="relative flex-1 bg-background-secondary rounded-md border border-border-secondary focus-within:border-accent-primary focus-within:ring-2 focus-within:ring-accent-primary/10 transition-all duration-200 shadow-sm overflow-hidden">
                                        <textarea
                                            className="w-full bg-transparent border-none outline-none focus:ring-0 focus:outline-none focus:border-transparent resize-none px-4 py-3 text-text-primary placeholder:text-text-tertiary min-h-[50px] max-h-[120px]"
                                            placeholder={`Message ${activeParticipant?.username || 'user'}...`}
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e);
                                                }
                                            }}
                                            rows={1}
                                            style={{ boxShadow: 'none' }}
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        disabled={!newMessage.trim()}
                                        className={`h-[50px] w-[50px] rounded-md flex items-center justify-center shrink-0 transition-all duration-200 ${newMessage.trim() ? 'shadow-md shadow-accent-primary/30' : ''}`}
                                    >
                                        <Send size={20} className={newMessage.trim() ? "translate-x-0.5" : ""} />
                                    </Button>
                                </form>
                                <div className="text-center mt-2">
                                    <span className="text-[10px] text-text-tertiary">Press <kbd className="font-sans font-medium px-1 bg-surface-secondary border border-border-primary rounded">Enter</kbd> to send, <kbd className="font-sans font-medium px-1 bg-surface-secondary border border-border-primary rounded">Shift + Enter</kbd> for new line</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-text-secondary text-body-md bg-background-secondary/30 relative">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-50"></div>
                            <div className="z-10 flex flex-col items-center max-w-sm text-center p-8">
                                <div className="w-16 h-16 bg-blue-50 text-accent-primary rounded-md flex items-center justify-center mb-6 shadow-inner">
                                    <MessageSquare size={32} />
                                </div>
                                <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Your Messages</h2>
                                <p className="text-text-secondary text-sm">
                                    Select a conversation from the sidebar or start a new one from a developer's storefront.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagingPage;
