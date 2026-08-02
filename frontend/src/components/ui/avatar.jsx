import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Avatar = forwardRef(({ className, src, alt, fallback, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-background-secondary", className)}
      {...props}
    >
      {src ? (
        <img className="aspect-square h-full w-full object-cover" src={src} alt={alt || "Avatar"} />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-medium text-text-secondary">
          {fallback}
        </div>
      )}
    </div>
  );
});
Avatar.displayName = "Avatar";

export { Avatar };
