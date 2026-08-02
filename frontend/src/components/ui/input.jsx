import React, { forwardRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(({ className, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="relative w-full">
            <input
                type={isPassword ? (showPassword ? "text" : "password") : type}
                className={cn(
                    "flex h-10 w-full rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm text-text-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-50",
                    isPassword && "pr-10",
                    error && "border-error focus-visible:ring-error",
                    className,
                )}
                ref={ref}
                {...props}
            />
            {isPassword && (
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            )}
        </div>
    );
});
Input.displayName = "Input";

export { Input };
