import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(input: string): string {
  if (!input) {
      return input; // Return the input as is if it's empty or null
  }

  // Replace dashes with spaces and capitalize the start of each word
  return input
      .replace(/-/g, ' ') // Replace dashes with spaces
      .split(' ') // Split the string into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' '); // Join the words back into a single string
}