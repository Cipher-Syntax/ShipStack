import React, { useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";

const Toast = ({
    title,
    description,
    variant = "info",
    onClose,
    duration = 3000,
}) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const variantStyles = {
        info: "bg-surface-primary border-border-primary text-text-primary",
        success: "bg-success border-success text-white",
        error: "bg-error border-error text-white",
    };

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4 flex w-full max-w-md items-center justify-between space-x-4 rounded-md border p-4 shadow-lg transition-all",
                variantStyles[variant],
            )}
        >
            <div className="flex-1">
                {title && <h3 className="font-medium text-sm">{title}</h3>}
                {description && (
                    <p className="text-sm opacity-90">{description}</p>
                )}
            </div>
            <button
                onClick={onClose}
                className="p-1 rounded-md hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-focus-ring"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export { Toast };
