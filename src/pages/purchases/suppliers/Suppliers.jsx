import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Plus,
  Search,
  Truck,
  Users,
  CheckCircle,
  XCircle,
  ShoppingCart,
  RefreshCw,
  Pencil,
} from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const Suppliers = () => {
  const toast = useToast();

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
      toast.error(
        "Load Failed",
        error.response?.data?.message || "Unable to load suppliers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const query = search.toLowerCase();

    return suppliers.filter((supplier) => {
      const value = `
        ${supplier.name || ""}
        ${supplier.company || ""}
        ${supplier.email || ""}
        ${supplier.phone || ""}
        ${supplier.city || ""}
        ${supplier.state || ""}
        ${supplier.gst || ""}
        ${supplier.gstNumber || ""}
      `;

      return value.toLowerCase().includes(query);
    });
  }, [suppliers, search]);

  const stats = useMemo(() => {
    const total = suppliers.length;

    const active = suppliers.filter(
      (item) => item.status?.toLowerCase() === "active"
    ).length;

    const inactive = suppliers.filter(
      (item) => item.status?.toLowerCase() !== "active"
    ).length;

    const totalOutstanding = suppliers.reduce(
      (sum, item) => sum + Number(item.openingBalance || item.balance || 0),
      0
    );

    return {
      total,
      active,
      inactive,
      totalOutstanding,
    };
  }, [suppliers]);

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

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
          <p className="mt-1 text-gray-500">
            Manage supplier records, GST details, contact information, and
            purchase vendors.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={fetchSuppliers}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>

          <Link to="/purchases/suppliers/add">
            <Button className="w-full bg-emerald-500 text-white hover:bg-emerald-600 sm:w-auto">
              <Plus size={18} />
              Add Supplier
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <Users size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Suppliers</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.total}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <CheckCircle size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Active Suppliers</p>
              <h3 className="text-2xl font-bold text-emerald-600">
                {stats.active}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <XCircle size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Inactive Suppliers</p>
              <h3 className="text-2xl font-bold text-red-500">
                {stats.inactive}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <ShoppingCart size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Opening Balance</p>
              <h3 className="text-2xl font-bold text-gray-900">
                ₹{Number(stats.totalOutstanding || 0).toLocaleString("en-IN")}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-white p-5">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
            <Truck size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">Supplier List</h2>
            <p className="text-sm text-gray-500">
              View, search, and manage all registered suppliers.
            </p>
          </div>
        </div>

        <div className="my-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search name, company, phone, email, city, GST..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredSuppliers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {suppliers.length}
            </span>{" "}
            suppliers
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Supplier</th>
                <th className="px-4 py-3 text-left font-semibold">Company</th>
                <th className="px-4 py-3 text-left font-semibold">GST No</th>
                <th className="px-4 py-3 text-left font-semibold">Contact</th>
                <th className="px-4 py-3 text-left font-semibold">Location</th>
                <th className="px-4 py-3 text-left font-semibold">Balance</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-10 text-center text-gray-500"
                  >
                    Loading suppliers...
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => {
                  const gstNo = supplier.gst || supplier.gstNumber || "N/A";
                  const balance =
                    supplier.openingBalance || supplier.balance || 0;

                  return (
                    <tr key={supplier._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {supplier.name || "N/A"}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Contact: {supplier.contactPerson || "N/A"}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {supplier.company || "N/A"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">{gstNo}</td>

                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <p className="text-gray-700">
                            {supplier.phone || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {supplier.email || "N/A"}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div>
                          <p className="text-gray-700">
                            {supplier.city || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {supplier.state || ""}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-semibold text-gray-900">
                        ₹{Number(balance || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant={getStatusVariant(supplier.status)}>
                          {supplier.status || "Inactive"}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/purchases/suppliers/${supplier._id}`}>
                            <button className="rounded-lg p-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600">
                              <Eye size={17} />
                            </button>
                          </Link>

                          <Link
                            to={`/purchases/suppliers/edit/${supplier._id}`}
                          >
                            <button className="rounded-lg p-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600">
                              <Pencil size={17} />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {!loading && filteredSuppliers.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Truck className="mx-auto mb-3 text-gray-300" size={38} />
              No suppliers found.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Suppliers;