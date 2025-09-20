/**
 * Format currency values for display
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1,000.00" or "$5.00")
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return "—";
  }
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format dates for display
 * @param date - The date to format (string or Date)
 * @returns Formatted date string (e.g., "Aug 31, 2025")
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateObj);
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - The date to format
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays === -1) {
    return "Tomorrow";
  } else if (diffInDays > 0) {
    return `In ${diffInDays} day${diffInDays === 1 ? "" : "s"}`;
  } else {
    return `${Math.abs(diffInDays)} day${Math.abs(diffInDays) === 1 ? "" : "s"} ago`;
  }
}

