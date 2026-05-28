import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Plus, Search, Truck } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Suppliers = () => {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/purchases/suppliers");

      if (res.data.success) {
        setSuppliers(res.data.suppliers || []);
      }
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const supplierName = supplier.name || "";
      const supplierEmail = supplier.email || "";

      return (
        supplierName.toLowerCase().includes(search.toLowerCase()) ||
        supplierEmail.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [suppliers, search]);

  const getStatusVariant = (status) => {
    if (status?.toLowerCase() === "active") return "success";
    return "danger";
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Purchases" },
          { label: "Suppliers" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>

          <p className="text-gray-500 mt-1">
            Manage supplier records, contact details, and purchase vendors.
          </p>
        </div>

        <Link to="/purchases/suppliers/add">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus size={18} />
            Add Supplier
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white">
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Truck size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Supplier List
            </h2>

            <p className="text-sm text-gray-500">
              View, search, and manage all registered suppliers.
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80 my-5">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search supplier by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-10`}
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">
                  Supplier
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Company
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Email
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Phone
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  City
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Status
                </th>

                <th className="text-right px-4 py-3 font-semibold">
                  Action
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
                    Loading suppliers...
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {supplier.name || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {supplier.company || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {supplier.email || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {supplier.phone || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {supplier.city || "N/A"}
                    </td>

                    <td className="px-4 py-4">
                      <Badge
                        variant={getStatusVariant(supplier.status)}
                      >
                        {supplier.status || "Inactive"}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <Link
                        to={`/purchases/suppliers/${supplier._id}`}
                      >
                        <button className="p-2 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-600">
                          <Eye size={17} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && filteredSuppliers.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Truck
                className="mx-auto mb-3 text-gray-300"
                size={38}
              />

              No suppliers found.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Suppliers;