import { useState, useCallback } from 'react';
import messagingService from '../services/messagingService';

export const useMessaging = () => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchConversations = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await messagingService.getConversations();
            setConversations(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch conversations');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchMessages = useCallback(async (conversationId) => {
        setIsLoading(true);
        try {
            const data = await messagingService.getMessages(conversationId);
            setMessages(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch messages');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const sendMessage = async (conversationId, content) => {
        try {
            const newMessage = await messagingService.sendMessage(conversationId, content);
            setMessages(prev => [...prev, newMessage]);
            return newMessage;
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Failed to send message');
        }
    };
    
    const startConversation = async (username) => {
        try {
            return await messagingService.getOrCreateConversation(username);
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Failed to start conversation');
        }
    };
    
    const markAsRead = async (conversationId) => {
        try {
             await messagingService.markAsRead(conversationId);
        } catch (err) {
             console.error("Failed to mark as read", err);
        }
    };

    return {
        conversations,
        messages,
        isLoading,
        error,
        fetchConversations,
        fetchMessages,
        sendMessage,
        startConversation,
        markAsRead
    };
};
