import { cn } from "@/lib/utils"

export function SktLogoIcon({ className }: { className?: string }) {
  return (
    <div className={cn("p-1 bg-primary/20 rounded-full", className)}>
        <div className="p-0.5 bg-background rounded-full">
        <svg
            className="size-6 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
            d="M5.5 16.5H18.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            />
            <path
            d="M8.5 20.5H15.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            />
            <rect
            x="3"
            y="4"
            width="18"
            height="10"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
            />
            <path
            d="M12 14V20.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            />
            <circle cx="12" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        </div>
    </div>
  )
}
