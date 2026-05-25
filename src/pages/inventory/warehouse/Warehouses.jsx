import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Download, Warehouse, Edit, Trash2 } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Warehouses = () => {
  const [search, setSearch] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/warehouses");

      if (res.data.success) {
        setWarehouses(res.data.warehouses || []);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load warehouses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this warehouse?"
    );

    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/warehouses/${id}`);

      if (res.data.success) {
        toast.success("Deleted", "Warehouse deleted successfully.");
        setWarehouses((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error(
        "Delete Failed",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((item) => {
      const value = `${item.name || ""} ${item.code || ""} ${
        item.city || ""
      } ${item.managerName || ""}`;

      return value.toLowerCase().includes(search.toLowerCase());
    });
  }, [warehouses, search]);

  const stats = useMemo(() => {
    return {
      total: warehouses.length,
      active: warehouses.filter((item) => item.status === "active").length,
      inactive: warehouses.filter((item) => item.status === "inactive").length,
    };
  }, [warehouses]);

  const exportWarehouses = () => {
    const rows = [
      ["Warehouse", "Code", "City", "Manager", "Phone", "Status"],
      ...filteredWarehouses.map((item) => [
        item.name || "",
        item.code || "",
        item.city || "",
        item.managerName || "",
        item.phone || "",
        item.status || "",
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "warehouses.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Warehouse" },
          { label: "Warehouses" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
          <p className="text-gray-500 mt-1">
            Manage all warehouse locations and availability.
          </p>
        </div>

        <Link to="/inventory/warehouses/add">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus size={18} />
            Add Warehouse
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Warehouse size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Warehouses</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.total}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Active Warehouses</p>
          <h3 className="text-2xl font-bold text-emerald-600">
            {stats.active}
          </h3>
        </Card>

        <Card className="p-5 bg-white">
          <p className="text-sm text-gray-500">Inactive Warehouses</p>
          <h3 className="text-2xl font-bold text-orange-500">
            {stats.inactive}
          </h3>
        </Card>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search warehouse..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>

          <Button variant="outline" onClick={exportWarehouses}>
            <Download size={18} />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Warehouse
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Code
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  City
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Manager
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Phone
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Loading warehouses...
                  </td>
                </tr>
              ) : filteredWarehouses.length > 0 ? (
                filteredWarehouses.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {item.name}
                      <p className="text-xs text-gray-400 mt-1">
                        {item.address || "No address"}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{item.code}</td>
                    <td className="px-4 py-4 text-gray-600">
                      {item.city || "-"}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {item.managerName || "-"}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {item.phone || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold capitalize ${
                          item.status === "active"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-orange-50 text-orange-600 border-orange-100"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/inventory/warehouses/edit/${item._id}`}>
                          <button className="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                            <Edit size={16} className="mx-auto" />
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="h-9 w-9 rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={16} className="mx-auto" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    No warehouses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Warehouses;