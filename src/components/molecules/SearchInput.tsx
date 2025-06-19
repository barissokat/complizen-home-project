/**
 * SearchInput Component
 *
 * Provides debounced search functionality for medical devices
 * with real-time filtering and keyboard navigation support.
 *
 * Used in: Dashboard layout, Device finder
 * Dependencies: React Hook Form, Zustand store integration
 */

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Search, X, Loader2 } from "lucide-react";
import { useGraphStore } from "@/stores";
import { Input } from "@/components/atoms/ui/input";
import { Button } from "@/components/atoms/ui/button";

/**
 * Search form data interface
 * Defines the structure of search input data
 */
interface SearchFormData {
  query: string;
}

/**
 * SearchInput component props
 * Configurable search behavior options
 */
interface SearchInputProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

/**
 * Debounced search input component
 *
 * Features:
 * - Real-time search with 300ms debounce
 * - Integration with Zustand store
 * - Loading states and clear functionality
 * - Responsive design with proper accessibility
 */
export default function SearchInput({
  placeholder = "Search devices by K-number, name, or manufacturer...",
  className = "",
  autoFocus = false,
}: SearchInputProps) {
  // Zustand store integration
  const {
    searchTerm,
    isSearching,
    setIsSearching,
    clearSearch,
    performSearch,
  } = useGraphStore();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchFormData>({
    defaultValues: {
      query: searchTerm,
    },
  });

  // Watch for input changes (for debounced search)
  const currentQuery = watch("query");

  /**
   * Debounced search effect
   * Automatically triggers search 300ms after user stops typing
   *
   * Performance: Prevents excessive store updates during typing
   * UX: Smart debounce - no loading during backspace/deletion
   */
  useEffect(() => {
    // Skip debounced search if query is empty or too short
    if (!currentQuery || currentQuery.length < 2) {
      if (searchTerm) {
        clearSearch(); // Clear previous search if query becomes empty
      }
      return;
    }

    // Skip if query hasn't changed (prevents unnecessary re-search)
    if (currentQuery === searchTerm) {
      return;
    }

    // Debounced search logic - 300ms delay
    const debounceTimer = setTimeout(() => {
      console.log("Debounced search triggered:", currentQuery);

      // Light loading state - doesn't block input
      setIsSearching(true);
      performSearch(currentQuery);

      // Quick search processing (input stays enabled)
      setTimeout(() => {
        setIsSearching(false);
        console.log("Search completed for:", currentQuery);
      }, 150); // Reduced from 200ms to 150ms for faster feel
    }, 300);

    // Cleanup: Cancel previous timer if user keeps typing/deleting
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [currentQuery, searchTerm, performSearch, setIsSearching, clearSearch]);

  /**
   * Handle search form submission (Enter key)
   * Immediate search without debounce delay
   */
  const onSubmit = (data: SearchFormData) => {
    console.log("Immediate search submitted:", data.query);

    // Skip if already searching or same term
    if (isSearching || data.query === searchTerm) {
      return;
    }

    performSearch(data.query);
    setIsSearching(true);

    // Immediate search processing
    setTimeout(() => {
      setIsSearching(false);
    }, 200);
  };

  /**
   * Clear search input and reset store state
   * Provides quick way to reset search results
   */
  const handleClear = () => {
    setValue("query", "");
    clearSearch();
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>

        {/* Search Input */}
        <Input
          {...register("query", {
            minLength: {
              value: 2,
              message: "Search term must be at least 2 characters",
            },
          })}
          type="text"
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-3 h-12"
          disabled={false}
        />

        {/* Loading Indicator */}
        {isSearching && (
          <div className="absolute inset-y-0 right-10 flex items-center">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Clear Button */}
        {currentQuery && !isSearching && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute inset-y-0 right-3 my-auto h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Hidden Submit Button for Enter Key */}
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      {/* Error Display */}
      {errors.query && (
        <p className="mt-1 text-sm text-red-600">{errors.query.message}</p>
      )}

      {/* Development Info */}
      <div className="mt-2 text-xs text-gray-500">
        Current query: &quot;{currentQuery}&quot; | Store term: &quot;
        {searchTerm}&quot; | Searching: {isSearching ? "Yes" : "No"} |
        Debounced: {currentQuery !== searchTerm ? "Waiting..." : "Synced"}
      </div>
    </div>
  );
}
