import { cn } from "@/lib/utils"

export function FirebaseLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn(className)}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Firebase Logo"
    >
      <path
        d="M11.996 49.999l30-29.998-10.25-10.25-29.997 30 10.247 10.248z"
        fill="#f57c00"
      />
      <path d="M42 9.75L31.75 0l-29.997 30 10.247 10.248L42 9.75z" fill="#ffca28" />
      <path d="M11.996 50l14.288 14.288L49.999 30.25 42 22.246 11.996 50z" fill="#ffa000" />
      <path d="M42 22.246L31.75 32.5l-6.75-6.75-7.25 7.25L32 47.248l18-18L42 22.246z" fill="#eceff1" />
    </svg>
  );
}
