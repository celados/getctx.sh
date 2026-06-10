import { type ClassValue, clsx } from "clsx"

// No tailwind-merge: WebTUI + CSS Modules don't produce conflicting atomic classes.
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
