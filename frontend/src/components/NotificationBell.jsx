import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, X, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const recentNotifications = notifications.slice(0, 5);

    const handleNotificationClick = async (notification) => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
        }
        setIsOpen(false);
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-full transition-colors"
                title="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background-primary">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-background-primary border border-border-primary rounded-xl shadow-xl overflow-hidden z-50 flex flex-col">
                    <div className="p-4 border-b border-border-primary flex items-center justify-between bg-background-secondary">
                        <h3 className="font-bold text-text-primary">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    markAllAsRead();
                                }}
                                className="text-xs text-accent-primary hover:text-accent-hover font-medium flex items-center gap-1"
                            >
                                <Check size={14} /> Mark all read
                            </button>
                        )}
                    </div>
                    
                    <div className="overflow-y-auto max-h-[400px]">
                        {recentNotifications.length > 0 ? (
                            recentNotifications.map(notification => (
                                <div 
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`p-4 border-b border-border-primary hover:bg-background-secondary cursor-pointer transition-colors relative group ${!notification.is_read ? 'bg-blue-50/30' : ''}`}
                                >
                                    {!notification.is_read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-primary" />
                                    )}
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                            notification.notification_type === 'PURCHASE' ? 'bg-green-100 text-green-700' :
                                            notification.notification_type === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                                            notification.notification_type === 'REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                                            notification.notification_type === 'MESSAGE' ? 'bg-purple-100 text-purple-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {notification.notification_type}
                                        </span>
                                        <span className="text-[11px] text-text-tertiary">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-text-primary text-sm mt-2">{notification.title}</h4>
                                    <p className="text-sm text-text-secondary line-clamp-2 mt-1">{notification.message}</p>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center flex flex-col items-center justify-center text-text-tertiary">
                                <Bell size={32} className="mb-2 opacity-50" />
                                <p>You're all caught up!</p>
                            </div>
                        )}
                    </div>

                    <Link 
                        to="/dashboard/notifications" 
                        onClick={() => setIsOpen(false)}
                        className="p-3 text-center text-sm text-accent-primary font-medium hover:bg-background-secondary border-t border-border-primary flex items-center justify-center gap-1"
                    >
                        View all notifications <ExternalLink size={14} />
                    </Link>
                </div>
            )}
        </div>
    );
}
