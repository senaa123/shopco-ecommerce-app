import { ProductsTable } from "@/components/admin/products-table";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/api-types";

export default async function AdminProductsPage() {
  let products: Product[] = [];
  try {
    products = (await getProducts({ limit: 100, sort: "newest" })).data;
  } catch {
    products = [];
  }
  return <ProductsTable products={products} />;
}
