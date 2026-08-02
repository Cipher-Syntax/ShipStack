import React from "react";
import { Modal } from "./modal";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";

const Dialog = ({ isOpen, onClose, title, description, children, className }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={cn("p-0 overflow-hidden", className)}>
      <div className="flex items-center justify-between p-6 border-b border-border-primary">
        <div>
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
        <button onClick={onClose} className="p-2 rounded-md hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring">
          <X className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </Modal>
  );
};

export { Dialog };
