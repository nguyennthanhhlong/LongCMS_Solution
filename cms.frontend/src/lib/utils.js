import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url, fallbackText = 'No+Image') {
  if (!url) return `https://via.placeholder.com/400x400?text=${fallbackText}`;
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.REACT_APP_IMAGE_BASE_URL || 'http://localhost:5151';
  return `${baseUrl}${url}`;
}
