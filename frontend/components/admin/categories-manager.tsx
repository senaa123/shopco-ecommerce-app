"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { ApiError, createCategory, updateCategory } from "@/lib/api";
import type { Category } from "@/lib/api-types";

export function CategoriesManager({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(categories);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", slug: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const created = await createCategory({
        name: newName,
        slug: newSlug || undefined,
      });
      setRows((r) => [...r, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
      setNewSlug("");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add category");
    } finally {
      setBusy(false);
    }
  }

  async function save(id: string) {
    setBusy(true);
    setError(null);
    try {
      const updated = await updateCategory(id, {
        name: draft.name,
        slug: draft.slug,
      });
      setRows((r) => r.map((c) => (c.id === id ? updated : c)));
      setEditing(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl">Categories</h1>

      <Card className="p-6">
        <h2 className="mb-3 text-lg font-bold">Add category</h2>
        <form onSubmit={add} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-primary-600">Name</span>
            <Input
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
             
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-primary-600">Slug (optional)</span>
            <Input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="auto from name"
             
            />
          </label>
          <Button type="submit" disabled={busy}>
            Add
          </Button>
        </form>
      </Card>

      {error && <p className="text-sm text-sale">{error}</p>}

      <Table>
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Slug</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {rows.length === 0 ? (
            <TR>
              <TD colSpan={3} className="py-10 text-center text-primary-400">
                No categories yet.
              </TD>
            </TR>
          ) : (
            rows.map((c) =>
              editing === c.id ? (
                <TR key={c.id}>
                  <TD>
                    <Input
                      value={draft.name}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, name: e.target.value }))
                      }
                     
                    />
                  </TD>
                  <TD>
                    <Input
                      value={draft.slug}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, slug: e.target.value }))
                      }
                     
                    />
                  </TD>
                  <TD className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => save(c.id)}
                        className="text-sm font-medium text-foreground hover:underline"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="text-sm text-primary-400 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </TD>
                </TR>
              ) : (
                <TR key={c.id}>
                  <TD className="font-medium">{c.name}</TD>
                  <TD className="font-mono text-xs text-primary-500">{c.slug}</TD>
                  <TD className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(c.id);
                        setDraft({ name: c.name, slug: c.slug });
                      }}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Edit
                    </button>
                  </TD>
                </TR>
              ),
            )
          )}
        </TBody>
      </Table>
    </div>
  );
}
