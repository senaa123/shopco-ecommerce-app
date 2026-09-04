import { cn } from "@/lib/cn";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-[30px] min-w-[46px] items-center justify-center rounded-md border border-black/[0.07] bg-white px-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      {children}
    </span>
  );
}

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.05 12.66c-.03-2.7 2.2-4 2.3-4.06-1.25-1.83-3.2-2.08-3.9-2.11-1.66-.17-3.24.98-4.08.98-.85 0-2.15-.96-3.53-.93-1.82.03-3.5 1.06-4.43 2.68-1.9 3.29-.48 8.16 1.35 10.83.9 1.31 1.96 2.77 3.35 2.72 1.35-.05 1.86-.87 3.49-.87 1.62 0 2.08.87 3.5.84 1.45-.02 2.36-1.32 3.24-2.63 1.03-1.51 1.45-2.98 1.47-3.05-.03-.01-2.82-1.08-2.85-4.29ZM14.35 4.8c.74-.9 1.24-2.14 1.1-3.38-1.07.04-2.36.71-3.12 1.6-.68.79-1.28 2.06-1.12 3.27 1.19.09 2.4-.6 3.14-1.5Z" />
    </svg>
  );
}

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.07H2.18a11 11 0 0 0 0 9.87l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.7 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export function PaymentBadges({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      <Badge>
        <span className="text-[13px] font-black italic tracking-[-0.03em] text-[#1434CB]">
          VISA
        </span>
      </Badge>

      <Badge>
        <svg viewBox="0 0 40 24" className="h-[18px] w-[28px]" aria-hidden>
          <circle cx="15" cy="12" r="10" fill="#EB001B" />
          <circle cx="25" cy="12" r="10" fill="#F79E1B" />
          <path
            d="M20 4.2a10 10 0 0 1 0 15.6 10 10 0 0 1 0-15.6Z"
            fill="#FF5F00"
          />
        </svg>
      </Badge>

      <Badge>
        <span className="text-[13px] font-extrabold italic tracking-[-0.02em]">
          <span className="text-[#003087]">Pay</span>
          <span className="text-[#0070E0]">Pal</span>
        </span>
      </Badge>

      <Badge>
        <span className="flex items-center gap-0.5 text-[13px] font-semibold text-black">
          <AppleLogo className="h-[15px] w-[15px]" />
          Pay
        </span>
      </Badge>

      <Badge>
        <span className="flex items-center gap-1 text-[13px] font-medium text-[#5F6368]">
          <GoogleG className="h-[15px] w-[15px]" />
          Pay
        </span>
      </Badge>
    </div>
  );
}
