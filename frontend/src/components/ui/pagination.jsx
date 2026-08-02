import React from "react";
import { cn } from "../../utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  return (
    <nav className={cn("flex items-center justify-center space-x-2", className)} aria-label="pagination">
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-sm text-text-secondary font-medium">
        Page {currentPage} of {totalPages}
      </div>
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};

export { Pagination };
