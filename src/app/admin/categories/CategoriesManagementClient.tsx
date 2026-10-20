"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Cpu,
  Smartphone,
  Megaphone,
  Code,
  GraduationCap,
  Monitor,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { slugify } from "@/lib/utils";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
  _count: { products: number };
}

interface Props {
  initialCategories: CategoryWithCount[];
}

export function CategoriesManagementClient({ initialCategories }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Package");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setIcon("Package");
    setDisplayOrder(categories.length);
    setIsActive(true);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setIcon(cat.icon || "Package");
    setDisplayOrder(cat.displayOrder);
    setIsActive(cat.isActive);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCategory?.id,
          name,
          slug,
          description: description || null,
          icon,
          displayOrder: Number(displayOrder),
          isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      setSuccess("Category saved successfully!");
      setIsModalOpen(false);
      router.refresh();

      // Update local state
      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? {
                  ...c,
                  name,
                  slug,
                  description,
                  icon,
                  displayOrder: Number(displayOrder),
                  isActive,
                }
              : c
          )
        );
      } else {
        setCategories((prev) => [
          ...prev,
          {
            ...data.category,
            _count: { products: 0 },
          },
        ]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete category");
        return;
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } catch {
      alert("An unexpected error occurred while deleting.");
    }
  };

  const renderIconPreview = (iconName: string | null) => {
    switch (iconName) {
      case "Cpu":
        return <Cpu className="w-4 h-4 text-[#00D9FF]" />;
      case "Smartphone":
        return <Smartphone className="w-4 h-4 text-purple-400" />;
      case "Megaphone":
        return <Megaphone className="w-4 h-4 text-emerald-400" />;
      case "Code":
        return <Code className="w-4 h-4 text-cyan-400" />;
      case "GraduationCap":
        return <GraduationCap className="w-4 h-4 text-amber-400" />;
      case "Monitor":
        return <Monitor className="w-4 h-4 text-blue-400" />;
      default:
        return <Package className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC]">
            Category Management
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Organize digital products, services, subscriptions, and courses into categories.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          className="flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-[#0B1224] border border-[#1B2A45] p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1B2A45] text-[#94A3B8] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Icon</th>
                <th className="py-3 px-3">Category Name</th>
                <th className="py-3 px-3">Slug</th>
                <th className="py-3 px-3">Products</th>
                <th className="py-3 px-3">Order</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2A45]/40">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-[#101A30]/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="w-8 h-8 rounded-lg bg-[#101A30] border border-[#1B2A45] flex items-center justify-center">
                      {renderIconPreview(c.icon)}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-[#F8FAFC] block">{c.name}</span>
                    {c.description && (
                      <span className="text-[10px] text-[#94A3B8] line-clamp-1">
                        {c.description}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#94A3B8]">{c.slug}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#101A30] text-[#00D9FF] border border-[#1B2A45]">
                      {c._count.products} products
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[#94A3B8] font-mono">{c.displayOrder}</td>
                  <td className="py-3.5 px-3">
                    {c.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(c)}
                        className="p-1.5 rounded-lg bg-[#101A30] text-[#94A3B8] hover:text-[#00D9FF] border border-[#1B2A45] transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id, c.name)}
                        className="p-1.5 rounded-lg bg-[#101A30] text-[#94A3B8] hover:text-rose-400 border border-[#1B2A45] transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Category Name *
            </label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. AI Subscriptions"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              URL Slug *
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. ai-subscriptions"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Icon Key
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-[#0B1224] border border-[#1B2A45] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF]"
            >
              <option value="Package">Package (Digital Products)</option>
              <option value="Cpu">Cpu (AI Subscriptions)</option>
              <option value="Smartphone">Smartphone (Premium Apps)</option>
              <option value="Megaphone">Megaphone (Digital Marketing)</option>
              <option value="Code">Code (Web Development)</option>
              <option value="GraduationCap">GraduationCap (Online Courses)</option>
              <option value="Monitor">Monitor (Software)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this category offers..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Display Order
              </label>
              <Input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Status
              </label>
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="catIsActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-[#1B2A45] bg-[#0B1224] text-[#00D9FF] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="catIsActive"
                  className="text-xs text-[#F8FAFC] cursor-pointer"
                >
                  Active on Storefront
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#1B2A45]">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
