"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="mx-auto max-w-[1240px] px-4">
      <div className="grid gap-6 rounded-[20px] bg-primary px-6 py-8 text-white md:grid-cols-2 md:items-center md:px-16 md:py-11">
        <h2 className="font-display text-3xl leading-tight md:text-4xl">
          Stay up to date about our latest offers
        </h2>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setDone(true);
          }}
        >
          {done ? (
            <p className="rounded-pill bg-white px-6 py-3 text-center text-sm font-medium text-primary">
              Thanks — you&apos;re subscribed.
            </p>
          ) : (
            <>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="h-12 rounded-pill bg-white px-6 text-sm text-foreground placeholder:text-primary-400 outline-none"
              />
              <Button
                type="submit"
                variant="secondary"
                className="h-12 bg-white text-primary"
              >
                Subscribe to Newsletter
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
