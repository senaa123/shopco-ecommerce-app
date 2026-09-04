"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import {
  ApiError,
  createProduct,
  updateProduct,
  type ProductVariantInput,
} from "@/lib/api";
import type { Category, Product } from "@/lib/api-types";

const TYPES = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];
const DRESS_STYLES = ["Casual", "Formal", "Party", "Gym"];

interface FormState {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  categoryId: string;
  type: string;
  dressStyle: string;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-primary-600">{label}</span>
      {children}
    </label>
  );
}

const selectClass =
  "h-11 rounded-pill bg-surface px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20";

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState<FormState>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    discountPrice: product?.discountPrice ? String(product.discountPrice) : "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    type: product?.type ?? "",
    dressStyle: product?.dressStyle ?? "",
  });
  const [variants, setVariants] = useState<ProductVariantInput[]>(
    product?.variants.map((v) => ({
      size: v.size,
      color: v.color,
      stock: v.stock,
    })) ?? [{ size: "", color: "", stock: 0 }],
  );
  const [images, setImages] = useState<string[]>(
    product?.images.map((i) => i.url) ?? [""],
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set =
    (k: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const scalars = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      categoryId: form.categoryId,
      type: form.type || null,
      dressStyle: form.dressStyle || null,
    };

    try {
      if (isEdit) {
        await updateProduct(product.id, scalars);
      } else {
        await createProduct({
          ...scalars,
          variants: variants
            .filter((v) => v.size && v.color)
            .map((v) => ({ ...v, stock: Number(v.stock) })),
          images: images.filter(Boolean).map((url) => ({ url })),
        });
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not save the product",
      );
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-3xl flex-col gap-6">
      <h1 className="font-display text-3xl">
        {isEdit ? "Edit Product" : "New Product"}
      </h1>

      <Card className="flex flex-col gap-4 p-6">
        <Field label="Name">
          <Input required value={form.name} onChange={set("name")} />
        </Field>
        <Field label="Description">
          <Textarea
            required
            rows={3}
            value={form.description}
            onChange={set("description")}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Price">
            <Input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={set("price")}
            />
          </Field>
          <Field label="Discount price (optional)">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.discountPrice}
              onChange={set("discountPrice")}
            />
          </Field>
          <Field label="Category">
            <select
              required
              className={selectClass}
              value={form.categoryId}
              onChange={set("categoryId")}
            >
              {categories.length === 0 && <option value="">No categories</option>}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Type">
            <select
              className={selectClass}
              value={form.type}
              onChange={set("type")}
            >
              <option value="">—</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Dress style">
            <select
              className={selectClass}
              value={form.dressStyle}
              onChange={set("dressStyle")}
            >
              <option value="">—</option>
              {DRESS_STYLES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      <Card className="flex flex-col gap-3 p-6">
        <h2 className="text-lg font-bold">Variants</h2>
        {isEdit ? (
          <>
            <ul className="flex flex-col gap-1 text-sm text-primary-600">
              {product.variants.map((v) => (
                <li key={v.id}>
                  {v.size} · {v.color} — {v.stock} in stock
                </li>
              ))}
            </ul>
            <p className="text-xs text-primary-400">
              Variants are set at creation. Editing them isn&apos;t wired to the
              backend yet.
            </p>
          </>
        ) : (
          <>
            {variants.map((v, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="Size"
                  value={v.size}
                  onChange={(e) =>
                    setVariants((rows) =>
                      rows.map((r, j) =>
                        j === i ? { ...r, size: e.target.value } : r,
                      ),
                    )
                  }
                  className="max-w-32"
                />
                <Input
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) =>
                    setVariants((rows) =>
                      rows.map((r, j) =>
                        j === i ? { ...r, color: e.target.value } : r,
                      ),
                    )
                  }
                  className="max-w-32"
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={String(v.stock)}
                  onChange={(e) =>
                    setVariants((rows) =>
                      rows.map((r, j) =>
                        j === i ? { ...r, stock: Number(e.target.value) } : r,
                      ),
                    )
                  }
                  className="max-w-24"
                />
                <button
                  type="button"
                  onClick={() =>
                    setVariants((rows) => rows.filter((_, j) => j !== i))
                  }
                  className="text-sm text-sale hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={() =>
                setVariants((rows) => [
                  ...rows,
                  { size: "", color: "", stock: 0 },
                ])
              }
            >
              Add variant
            </Button>
          </>
        )}
      </Card>

      <Card className="flex flex-col gap-3 p-6">
        <h2 className="text-lg font-bold">Image URLs</h2>
        {isEdit ? (
          <>
            <ul className="flex flex-col gap-1 break-all text-sm text-primary-600">
              {product.images.length === 0 && <li>—</li>}
              {product.images.map((img) => (
                <li key={img.id}>{img.url}</li>
              ))}
            </ul>
            <p className="text-xs text-primary-400">
              Images are set at creation.
            </p>
          </>
        ) : (
          <>
            {images.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  placeholder="https://…"
                  value={url}
                  onChange={(e) =>
                    setImages((rows) =>
                      rows.map((r, j) => (j === i ? e.target.value : r)),
                    )
                  }
                 
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages((rows) => rows.filter((_, j) => j !== i))
                  }
                  className="text-sm text-sale hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={() => setImages((rows) => [...rows, ""])}
            >
              Add image URL
            </Button>
          </>
        )}
      </Card>

      {error && <p className="text-sm text-sale">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
