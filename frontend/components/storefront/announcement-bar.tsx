"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CloseIcon } from "./icons";

const STORAGE_KEY = "shopco:announcement-dismissed";

export function AnnouncementBar() {
  // Start hidden so SSR and first client render match; reveal after we've
  // checked localStorage on mount.
  const [state, setState] = useState<"hidden" | "shown" | "dismissed">("hidden");

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      dismissed = false;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount sync with localStorage
    setState(dismissed ? "dismissed" : "shown");
  }, []);

  if (state !== "shown") return null;

  return (
    <div className="relative bg-primary px-4 py-2 text-center text-xs text-white sm:text-sm">
      <span>
        Sign up and get 20% off to your first order.{" "}
        <Link href="/register" className="font-semibold underline">
          Sign Up Now
        </Link>
      </span>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          setState("dismissed");
          try {
            localStorage.setItem(STORAGE_KEY, "1");
          } catch {
            /* ignore */
          }
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
