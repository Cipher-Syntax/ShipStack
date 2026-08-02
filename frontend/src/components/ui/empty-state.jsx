import React from "react";
import { cn } from "../../utils/cn";

const EmptyState = ({ icon: Icon, title, description, action, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-dashed border-border-secondary p-8 text-center", className)}>
      {Icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background-secondary mb-4">
          <Icon className="h-6 w-6 text-text-tertiary" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-semibold text-text-primary">{title}</h3>
      {description && <p className="mb-4 mt-2 text-sm text-text-secondary max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export { EmptyState };
