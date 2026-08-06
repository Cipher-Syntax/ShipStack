import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../../components/ui/button';

const NotificationCenterPage = () => {
    const { notifications, loading, error, markAsRead, markAllAsRead } = useNotifications();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-accent-primary" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="w-full p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 -ml-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-background-secondary transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-text-primary flex items-center gap-3">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="bg-red-100 text-red-700 text-sm py-0.5 px-2.5 rounded-full font-bold">
                                {unreadCount} new
                            </span>
                        )}
                    </h1>
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
                        <Check size={16} /> Mark all as read
                    </Button>
                )}
            </div>

            {notifications.length > 0 ? (
                <div className="bg-background-secondary rounded-2xl shadow-sm border border-border-primary overflow-hidden">
                    <div className="divide-y divide-border-primary">
                        {notifications.map((notification) => (
                            <div 
                                key={notification.id}
                                className={`p-6 transition-colors flex flex-col md:flex-row md:items-start gap-4 ${!notification.is_read ? 'bg-blue-50/20' : 'hover:bg-background-primary'}`}
                            >
                                <div className="shrink-0 pt-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        notification.notification_type === 'PURCHASE' ? 'bg-green-100 text-green-600' :
                                        notification.notification_type === 'UPDATE' ? 'bg-blue-100 text-blue-600' :
                                        notification.notification_type === 'REVIEW' ? 'bg-yellow-100 text-yellow-600' :
                                        notification.notification_type === 'MESSAGE' ? 'bg-purple-100 text-purple-600' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        <Bell size={18} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                            notification.notification_type === 'PURCHASE' ? 'bg-green-100 text-green-700' :
                                            notification.notification_type === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                                            notification.notification_type === 'REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                                            notification.notification_type === 'MESSAGE' ? 'bg-purple-100 text-purple-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {notification.notification_type}
                                        </span>
                                        <span className="text-sm text-text-tertiary">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-text-primary text-lg mb-1">{notification.title}</h3>
                                    <p className="text-text-secondary leading-relaxed mb-4">{notification.message}</p>
                                    
                                    <div className="flex items-center gap-3">
                                        {notification.link && (
                                            <Link to={notification.link}>
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                                                >
                                                    View Details
                                                </Button>
                                            </Link>
                                        )}
                                        {!notification.is_read && (
                                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                                Mark as Read
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                {!notification.is_read && (
                                    <div className="hidden md:block shrink-0">
                                        <div className="w-2 h-2 bg-accent-primary rounded-full mt-3"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center mt-20 text-center">
                    <div className="w-20 h-20 bg-background-secondary rounded-full flex items-center justify-center mb-6">
                        <Bell size={32} className="text-text-tertiary" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">No notifications yet</h3>
                    <p className="text-text-secondary max-w-sm">When you receive updates about your purchases, listings, or messages, they will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default NotificationCenterPage;
