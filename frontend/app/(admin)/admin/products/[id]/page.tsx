import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { ApiError, getCategories, getProductById } from "@/lib/api";
import type { Category, Product } from "@/lib/api-types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: Product;
  let categories: Category[] = [];
  try {
    [product, categories] = await Promise.all([
      getProductById(id),
      getCategories().catch(() => [] as Category[]),
    ]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return <ProductForm categories={categories} product={product} />;
}
