import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Drawer = ({ isOpen, onClose, title, children, className }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            
            {/* Drawer */}
            <div className={cn("relative w-full max-w-sm h-full bg-surface-primary shadow-2xl flex flex-col animate-in slide-in-from-right duration-300", className)}>
                <div className="flex items-center justify-between p-4 border-b border-border-primary">
                    <h2 className="text-lg font-bold font-display text-text-primary">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-background-secondary text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
