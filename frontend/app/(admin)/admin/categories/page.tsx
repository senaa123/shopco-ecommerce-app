import { CategoriesManager } from "@/components/admin/categories-manager";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/api-types";

export default async function AdminCategoriesPage() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }
  return <CategoriesManager categories={categories} />;
}
