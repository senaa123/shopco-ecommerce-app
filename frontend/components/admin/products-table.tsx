"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { ApiError, deleteProduct } from "@/lib/api";
import type { Product } from "@/lib/api-types";
import { formatPrice } from "@/lib/format";

function totalStock(p: Product) {
  return p.variants.reduce((s, v) => s + v.stock, 0);
}

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(products);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q),
    );
  }, [rows, query]);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? It will be soft-deleted.`)) return;
    setBusyId(id);
    setError(null);
    try {
      await deleteProduct(id);
      setRows((r) => r.filter((p) => p.id !== id));
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Products</h1>
        <Link
          href="/admin/products/new"
          className={buttonVariants({ size: "sm", className: "px-5" })}
        >
          Add Product
        </Link>
      </div>

      <Input
        placeholder="Search by name, category or type…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm border border-border bg-white"
      />

      {error && <p className="text-sm text-sale">{error}</p>}

      <Table>
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Category</TH>
            <TH>Type</TH>
            <TH className="text-right">Price</TH>
            <TH className="text-right">Stock</TH>
            <TH>Status</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {filtered.length === 0 ? (
            <TR>
              <TD colSpan={7} className="py-10 text-center text-primary-400">
                No products found.
              </TD>
            </TR>
          ) : (
            filtered.map((p) => {
              const stock = totalStock(p);
              return (
                <TR key={p.id}>
                  <TD className="font-medium">{p.name}</TD>
                  <TD className="text-primary-500">{p.category?.name ?? "—"}</TD>
                  <TD className="text-primary-500">{p.type ?? "—"}</TD>
                  <TD className="text-right">
                    {formatPrice(p.discountPrice ?? p.price)}
                  </TD>
                  <TD className="text-right">
                    <span
                      className={
                        stock === 0
                          ? "text-sale"
                          : stock < 10
                            ? "text-orange-600"
                            : ""
                      }
                    >
                      {stock}
                    </span>
                  </TD>
                  <TD>
                    <Badge tone="success">Active</Badge>
                  </TD>
                  <TD className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="rounded-lg px-2 py-1 text-sm text-primary-600 hover:bg-surface"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={busyId === p.id}
                        onClick={() => handleDelete(p.id, p.name)}
                        className="rounded-lg px-2 py-1 text-sm text-sale hover:bg-surface disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </TD>
                </TR>
              );
            })
          )}
        </TBody>
      </Table>
      <p className="text-xs text-primary-400">
        Soft-deleted products are hidden from this list and the storefront.
      </p>
    </div>
  );
}
