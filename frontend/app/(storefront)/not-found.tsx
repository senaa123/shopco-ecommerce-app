import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-5xl">404</h1>
      <p className="text-primary-500">
        We couldn&apos;t find the page you were looking for.
      </p>
      <Link href="/shop/all" className={buttonVariants({ className: "px-10" })}>
        Continue shopping
      </Link>
    </div>
  );
}
