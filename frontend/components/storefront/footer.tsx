import Link from "next/link";
import { Newsletter } from "./newsletter";

const LINK_COLUMNS: { title: string; links: { label: string; href: string }[] }[] =
  [
    {
      title: "Company",
      links: [
        { label: "About", href: "/shop/all" },
        { label: "Features", href: "/shop/all" },
        { label: "Works", href: "/shop/all" },
        { label: "Career", href: "/shop/all" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "Customer Support", href: "/shop/all" },
        { label: "Delivery Details", href: "/shop/all" },
        { label: "Terms & Conditions", href: "/shop/all" },
        { label: "Privacy Policy", href: "/shop/all" },
      ],
    },
    {
      title: "FAQ",
      links: [
        { label: "Account", href: "/orders" },
        { label: "Manage Deliveries", href: "/orders" },
        { label: "Orders", href: "/orders" },
        { label: "Payments", href: "/orders" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Free eBooks", href: "/shop/all" },
        { label: "Development Tutorial", href: "/shop/all" },
        { label: "How to - Blog", href: "/shop/all" },
        { label: "Youtube Playlist", href: "/shop/all" },
      ],
    },
  ];

const PAYMENTS = ["VISA", "Mastercard", "PayPal", "Apple Pay", "Google Pay"];

export function Footer() {
  return (
    <footer className="mt-24">
      <div className="relative">
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-surface" />
        <div className="relative">
          <Newsletter />
        </div>
      </div>

      <div className="bg-surface pb-8 pt-16">
        <div className="mx-auto max-w-[1240px] px-4">
          <div className="grid gap-10 border-b border-border pb-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div className="flex flex-col gap-4">
              <span className="font-display text-2xl font-bold">SHOP.CO</span>
              <p className="max-w-xs text-sm text-primary-500">
                We have clothes that suit your style and which you&apos;re proud
                to wear. From women to men.
              </p>
            </div>
            {LINK_COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-foreground">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-primary-500 hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row">
            <p className="text-sm text-primary-400">
              Shop.co © 2000-2023, All Rights Reserved
            </p>
            <div className="flex gap-2">
              {PAYMENTS.map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-border bg-white px-2 py-1 text-[10px] font-semibold text-primary-500"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
