import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

const Modal = ({ isOpen, onClose, children, className }) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose();
            }}
            ref={overlayRef}
        >
            <div
                className={cn(
                    "bg-surface-primary rounded-xl shadow-xl w-full max-w-lg p-6 relative border border-border-primary",
                    className,
                )}
                role="dialog"
                aria-modal="true"
            >
                {children}
            </div>
        </div>
    );
};

export { Modal };
