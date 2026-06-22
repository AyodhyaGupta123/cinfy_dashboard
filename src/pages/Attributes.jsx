import React, { useState, useMemo } from "react";
import Button from "../components/UI/Button";
import StatCard from "../components/UI/StatCard";
import Card from "../components/UI/Card";
import Breadcrumb from "../components/UI/Breadcrumb";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Palette,
  List as ListIcon,
  Type as TypeIcon,
  Hash, 
  ChevronDown,
  Check,
  AlertTriangle,
  Tag,
} from "lucide-react";

const TYPE_META = {
  color: {
    label: "Color",
    icon: Palette,
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  select: {
    label: "Select",
    icon: ListIcon,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  text: {
    label: "Text",
    icon: TypeIcon,
    color: "bg-stone-100 text-stone-700 border-stone-200",
  },
  number: {
    label: "Number",
    icon: Hash,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
};

const COLOR_SWATCH = {
  Black: "#1c1917",
  White: "#ffffff",
  Red: "#dc2626",
  Blue: "#2563eb",
  Green: "#16a34a",
  Silver: "#a8a29e",
  Gold: "#d4a017",
  Pink: "#ec4899",
  Yellow: "#eab308",
  Purple: "#9333ea",
  Orange: "#ea580c",
  Grey: "#71717a",
  Gray: "#71717a",
  Navy: "#1e3a8a",
  Beige: "#e8dcc8",
};

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const initialData = [
  {
    id: 1,
    name: "Color",
    type: "color",
    values: ["Black", "White", "Red", "Blue", "Green"],
    status: "active",
    usedIn: 142,
  },
  {
    id: 2,
    name: "Size",
    type: "select",
    values: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    usedIn: 98,
  },
  {
    id: 3,
    name: "Material",
    type: "select",
    values: ["Cotton", "Polyester", "Leather", "Wool"],
    status: "active",
    usedIn: 76,
  },
  {
    id: 4,
    name: "Connectivity",
    type: "select",
    values: ["WiFi", "Bluetooth", "NFC", "USB-C"],
    status: "active",
    usedIn: 56,
  },
  {
    id: 5,
    name: "Storage Capacity",
    type: "select",
    values: ["64GB", "128GB", "256GB", "512GB"],
    status: "active",
    usedIn: 34,
  },
  {
    id: 6,
    name: "Weight (kg)",
    type: "number",
    values: [],
    status: "active",
    usedIn: 12,
  },
  {
    id: 7,
    name: "Brand Warranty",
    type: "text",
    values: [],
    status: "inactive",
    usedIn: 0,
  },
];

let nextId = 8;
const emptyForm = { name: "", type: "select", values: [], status: "active" };

export default function Attributes() {
  const [attributes, setAttributes] = useState(initialData);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [valueDraft, setValueDraft] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    return attributes.filter((a) => {
      const q = query.toLowerCase();
      const matchesQuery =
        a.name.toLowerCase().includes(q) || slugify(a.name).includes(q);
      const matchesType = typeFilter === "all" || a.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [attributes, query, typeFilter]);

  const stats = useMemo(
    () => ({
      total: attributes.length,
      active: attributes.filter((a) => a.status === "active").length,
      types: new Set(attributes.map((a) => a.type)).size,
    }),
    [attributes],
  );

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setValueDraft("");
    setPanelOpen(true);
  }

  function openEdit(attr) {
    setEditingId(attr.id);
    setForm({
      name: attr.name,
      type: attr.type,
      values: [...attr.values],
      status: attr.status,
    });
    setValueDraft("");
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
  }

  function addValue() {
    const v = valueDraft.trim();
    if (!v || form.values.includes(v)) return;
    setForm((f) => ({ ...f, values: [...f.values, v] }));
    setValueDraft("");
  }

  function removeValue(v) {
    setForm((f) => ({ ...f, values: f.values.filter((x) => x !== v) }));
  }

  function saveForm() {
    if (!form.name.trim()) return;
    if (editingId) {
      setAttributes((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...a,
                name: form.name.trim(),
                type: form.type,
                values: form.values,
                status: form.status,
              }
            : a,
        ),
      );
    } else {
      setAttributes((prev) => [
        ...prev,
        {
          id: nextId++,
          name: form.name.trim(),
          type: form.type,
          values: form.values,
          status: form.status,
          usedIn: 0,
        },
      ]);
    }
    setPanelOpen(false);
  }

  function confirmDelete() {
    setAttributes((prev) => prev.filter((a) => a.id !== deleteId));
    setDeleteId(null);
  }

  const needsValues = form.type === "select" || form.type === "color";

  return (
    <div className="min-h-full bg-stone-50 text-stone-900 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <Breadcrumb />
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-900">
              Product Attributes
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Define the properties shoppers use to filter and compare products.
            </p>
          </div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={openAdd}
            className="shrink-0"
          >
            Add attribute
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard
            label="Total attributes"
            value={stats.total}
            icon={Tag}
            accent="stone"
          />
          <StatCard
            label="Active"
            value={stats.active}
            icon={Check}
            accent="teal"
          />
          <StatCard
            label="Types in use"
            value={stats.types}
            icon={ListIcon}
            accent="indigo"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or code..."
              className="w-full bg-white border border-stone-200 rounded-lg pl-9 pr-3 py-2.5 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setTypeMenuOpen((o) => !o)}
              className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm text-stone-700 min-w-[140px] justify-between hover:border-stone-300 transition-colors"
            >
              {typeFilter === "all" ? "All types" : TYPE_META[typeFilter].label}
              <ChevronDown
                size={14}
                className={`text-stone-400 transition-transform ${
                  typeMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {typeMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-stone-200 rounded-lg shadow-lg overflow-hidden z-10">
                {["all", "color", "select", "text", "number"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTypeFilter(t);
                      setTypeMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm hover:bg-stone-50 flex items-center justify-between"
                  >
                    {t === "all" ? "All types" : TYPE_META[t].label}
                    {typeFilter === t && (
                      <Check size={14} className="text-teal-700" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/60">
                  <th className="text-left font-medium text-stone-500 text-xs uppercase tracking-wide px-4 py-3">
                    Name
                  </th>
                  <th className="text-left font-medium text-stone-500 text-xs uppercase tracking-wide px-4 py-3">
                    Type
                  </th>
                  <th className="text-left font-medium text-stone-500 text-xs uppercase tracking-wide px-4 py-3">
                    Values
                  </th>
                  <th className="text-left font-medium text-stone-500 text-xs uppercase tracking-wide px-4 py-3">
                    Used in
                  </th>
                  <th className="text-left font-medium text-stone-500 text-xs uppercase tracking-wide px-4 py-3">
                    Status
                  </th>
                  <th className="text-right font-medium text-stone-500 text-xs uppercase tracking-wide px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((attr) => {
                  const meta = TYPE_META[attr.type];
                  const Icon = meta.icon;
                  return (
                    <tr
                      key={attr.id}
                      className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-stone-900">
                          {attr.name}
                        </p>
                        <p className="text-xs text-stone-400 font-mono mt-0.5">
                          {slugify(attr.name)}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border ${meta.color}`}
                        >
                          <Icon size={12} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 max-w-[260px]">
                        {attr.values.length === 0 ? (
                          <span className="text-stone-400 text-xs">
                            Free text
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {attr.values.slice(0, 4).map((v) => (
                              <span
                                key={v}
                                className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded"
                              >
                                {attr.type === "color" && (
                                  <span
                                    className="w-2.5 h-2.5 rounded-full border border-stone-300 shrink-0"
                                    style={{
                                      backgroundColor:
                                        COLOR_SWATCH[v] || "#d6d3d1",
                                    }}
                                  />
                                )}
                                {v}
                              </span>
                            ))}
                            {attr.values.length > 4 && (
                              <span className="text-xs text-stone-400 px-1 py-0.5">
                                +{attr.values.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 tabular-nums text-stone-600">
                        {attr.usedIn} products
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md ${
                            attr.status === "active"
                              ? "bg-teal-50 text-teal-700"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              attr.status === "active"
                                ? "bg-teal-600"
                                : "bg-stone-400"
                            }`}
                          />
                          {attr.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(attr)}
                            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                            aria-label={`Edit ${attr.name}`}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteId(attr.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            aria-label={`Delete ${attr.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 px-4">
                <Tag className="mx-auto text-stone-300 mb-3" size={28} />
                <p className="text-stone-600 font-medium text-sm">
                  No attributes found
                </p>
                <p className="text-stone-400 text-xs mt-1">
                  Try a different search, or add a new attribute to get started.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Slide-over panel */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          panelOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-stone-900/30"
          onClick={closePanel}
        />
        <div
          className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transition-transform duration-300 flex flex-col ${
            panelOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
            <h2 className="text-base font-semibold text-stone-900">
              {editingId ? "Edit attribute" : "Add attribute"}
            </h2>
            <button
              onClick={closePanel}
              className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Fabric Type"
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300"
              />
              {form.name && (
                <p className="text-xs text-stone-400 mt-1 font-mono">
                  Code: {slugify(form.name)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(TYPE_META).map(([key, meta]) => (
                  <Button
                    key={key}
                    variant={form.type === key ? "primary" : "outline"}
                    size="sm"
                    icon={meta.icon}
                    onClick={() => setForm((f) => ({ ...f, type: key }))}
                  >
                    {meta.label}
                  </Button>
                ))}
              </div>
            </div>

            {needsValues && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Values
                </label>
                <div className="flex gap-2">
                  <input
                    value={valueDraft}
                    onChange={(e) => setValueDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addValue();
                      }
                    }}
                    placeholder="Type a value and press Enter"
                    className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300"
                  />
                  <Button variant="secondary" size="sm" onClick={addValue}>
                    Add
                  </Button>
                </div>
                {form.values.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {form.values.map((v) => (
                      <span
                        key={v}
                        className="inline-flex items-center gap-1.5 text-xs bg-stone-100 text-stone-700 pl-2 pr-1 py-1 rounded-md"
                      >
                        {form.type === "color" && (
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-stone-300"
                            style={{
                              backgroundColor: COLOR_SWATCH[v] || "#d6d3d1",
                            }}
                          />
                        )}
                        {v}
                        <button
                          onClick={() => removeValue(v)}
                          className="hover:text-red-600"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Status
              </label>
              <div className="flex gap-2">
                <Button
                  variant={form.status === "active" ? "primary" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setForm((f) => ({ ...f, status: "active" }))}
                >
                  Active
                </Button>
                <Button
                  variant={form.status === "inactive" ? "secondary" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setForm((f) => ({ ...f, status: "inactive" }))}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-stone-200 flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={closePanel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={saveForm}
              disabled={!form.name.trim()}
            >
              {editingId ? "Save changes" : "Add attribute"}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/40"
            onClick={() => setDeleteId(null)}
          />
          <Card className="relative max-w-sm w-full p-6">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 mb-1">
              Delete attribute?
            </h3>
            <p className="text-sm text-stone-500 mb-5">
              This removes "{attributes.find((a) => a.id === deleteId)?.name}"
              and its values. Products using it keep their current data, but the
              filter will no longer be available.
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
