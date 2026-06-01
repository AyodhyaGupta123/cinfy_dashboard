import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Ruler,
  RefreshCw,
} from "lucide-react";

import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const UnitList = () => {
  const toast = useToast();

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const res = await api.get("/units");

      setUnits(res.data.units || res.data || []);
    } catch (error) {
      toast.error(
        "Load Failed",
        error.response?.data?.message || "Failed to load units"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this unit?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/units/${id}`);
      toast.success("Unit Deleted", "Unit deleted successfully.");
      fetchUnits();
    } catch (error) {
      toast.error(
        "Delete Failed",
        error.response?.data?.message || "Failed to delete unit"
      );
    }
  };

  const filteredUnits = units.filter((unit) => {
    const keyword = search.toLowerCase();
    return (
      unit.name?.toLowerCase().includes(keyword) ||
      unit.abbreviation?.toLowerCase().includes(keyword) ||
      unit.unitType?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Units" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Units</h1>
          <p className="text-gray-500 mt-1">
            Manage product measurement units.
          </p>
        </div>

        <Link to="/inventory/units/add">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus size={18} />
            Add Unit
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Ruler size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">Unit List</h2>
              <p className="text-sm text-gray-500">
                Total {filteredUnits.length} units found.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search units..."
                className="w-full sm:w-72 h-11 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <Button type="button" variant="outline" onClick={fetchUnits}>
              <RefreshCw size={18} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  #
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Unit Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Abbreviation
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Unit Type
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Description
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-gray-500">
                    Loading units...
                  </td>
                </tr>
              ) : filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-gray-500">
                    No units found.
                  </td>
                </tr>
              ) : (
                filteredUnits.map((unit, index) => (
                  <tr
                    key={unit._id || index}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-gray-600">{index + 1}</td>

                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">
                        {unit.name}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-700">
                      {unit.abbreviation || "-"}
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 capitalize">
                        {unit.unitType || "base"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {unit.description || "-"}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/inventory/units/edit/${unit._id}`}>
                          <button
                            type="button"
                            className="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 flex items-center justify-center"
                          >
                            <Edit size={16} />
                          </button>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(unit._id)}
                          className="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UnitList;