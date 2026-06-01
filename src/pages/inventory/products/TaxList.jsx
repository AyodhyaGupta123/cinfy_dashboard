import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Search, Trash2, Percent } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const TaxList = () => {
  const toast = useToast();

  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/taxes");

      if (res.data.success) {
        setTaxes(res.data.data || []);
      }
    } catch (error) {
      toast.error(
        "Fetch Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tax?");
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/taxes/${id}`);

      if (res.data.success) {
        toast.success("Deleted", "Tax deleted successfully.");
        fetchTaxes();
      }
    } catch (error) {
      toast.error(
        "Delete Failed",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  const filteredTaxes = taxes.filter((tax) =>
    `${tax.name} ${tax.taxType} ${tax.applyOn}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Taxes" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Taxes</h1>
          <p className="text-gray-500 mt-1">
            Manage GST, VAT, sales tax and other inventory taxes.
          </p>
        </div>

        <Link to="/inventory/taxes/add">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus size={18} />
            Add Tax
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Percent size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">Tax List</h2>
              <p className="text-sm text-gray-500">
                View, edit and delete tax records.
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Search tax..."
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Tax Name</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Rate</th>
                <th className="px-4 py-3 text-left font-semibold">Apply On</th>
                <th className="px-4 py-3 text-left font-semibold">Calculation</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    Loading taxes...
                  </td>
                </tr>
              ) : filteredTaxes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No tax found.
                  </td>
                </tr>
              ) : (
                filteredTaxes.map((tax) => (
                  <tr key={tax._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {tax.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{tax.taxType}</td>
                    <td className="px-4 py-3 text-gray-600">{tax.taxRate}%</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">
                      {tax.applyOn}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tax.calculationType}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tax.status === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {tax.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/inventory/taxes/edit/${tax._id}`}>
                          <button className="h-9 w-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center">
                            <Edit size={16} />
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(tax._id)}
                          className="h-9 w-9 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 flex items-center justify-center"
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

export default TaxList;