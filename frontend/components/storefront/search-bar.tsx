"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "./icons";

export function SearchBar({
  className,
  initialValue = "",
}: {
  className?: string;
  initialValue?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        router.push(
          q ? `/shop/all?search=${encodeURIComponent(q)}` : "/shop/all",
        );
      }}
    >
      <Input
        type="search"
        name="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for products..."
        icon={<SearchIcon className="h-5 w-5" />}
        aria-label="Search for products"
      />
    </form>
  );
}
