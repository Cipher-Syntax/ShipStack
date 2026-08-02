import React, { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
    "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-focus-ring",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-background-secondary text-text-primary",
                success: "border-transparent bg-success text-white",
                warning: "border-transparent bg-warning text-white",
                error: "border-transparent bg-error text-white",
                info: "border-transparent bg-info text-white",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

const Badge = forwardRef(({ className, variant, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
});
Badge.displayName = "Badge";

export { Badge, badgeVariants };
