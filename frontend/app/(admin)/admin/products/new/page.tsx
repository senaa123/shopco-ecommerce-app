import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/api-types";

export default async function NewProductPage() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }
  return <ProductForm categories={categories} />;
}
