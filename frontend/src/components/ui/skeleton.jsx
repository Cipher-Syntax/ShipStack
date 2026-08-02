import React from "react";
import { cn } from "../../utils/cn";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-background-tertiary", className)}
      {...props}
    />
  );
}

export { Skeleton };
