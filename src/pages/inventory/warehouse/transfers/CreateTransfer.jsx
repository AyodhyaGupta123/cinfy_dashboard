import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, ArrowLeftRight } from "lucide-react";
import Card from "../../../../components/UI/Card";
import Button from "../../../../components/UI/Button";
import Breadcrumb from "../../../../components/UI/Breadcrumb";
import { useToast } from "../../../../components/UI/Toast";
import api from "../../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const CreateTransfer = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [formData, setFormData] = useState({
    product: "",
    fromWarehouse: "",
    toWarehouse: "",
    quantity: "",
    status: "pending",
    notes: "",
  });

  const fetchData = async () => {
    try {
      const [productsRes, warehousesRes] = await Promise.all([
        api.get("/products"),
        api.get("/warehouses"),
      ]);

      if (productsRes.data.success) {
        setProducts(productsRes.data.products || []);
      }

      if (warehousesRes.data.success) {
        setWarehouses(warehousesRes.data.warehouses || []);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load data"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.product) {
      toast.error("Validation Error", "Please select product.");
      return;
    }

    if (!formData.fromWarehouse) {
      toast.error("Validation Error", "Please select from warehouse.");
      return;
    }

    if (!formData.toWarehouse) {
      toast.error("Validation Error", "Please select to warehouse.");
      return;
    }

    if (formData.fromWarehouse === formData.toWarehouse) {
      toast.error(
        "Validation Error",
        "From and To warehouse cannot be same."
      );
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.error("Validation Error", "Quantity must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        product: formData.product,
        fromWarehouse: formData.fromWarehouse,
        toWarehouse: formData.toWarehouse,
        quantity: Number(formData.quantity),
        status: formData.status,
        notes: formData.notes,
      };

      const res = await api.post("/transfers", payload);

      if (res.data.success) {
        toast.success("Transfer Created", "Stock transfer created successfully.");
        navigate("/inventory/transfers");
      }
    } catch (error) {
      toast.error(
        "Create Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Warehouse" },
          { label: "Transfers", path: "/inventory/transfers" },
          { label: "Create Transfer" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Transfer</h1>
          <p className="text-gray-500 mt-1">
            Move stock from one warehouse to another warehouse.
          </p>
        </div>

        <Link to="/inventory/transfers">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back to Transfers
          </Button>
        </Link>
      </div>

      <Card className="p-5 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <ArrowLeftRight size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Transfer Information
              </h2>
              <p className="text-sm text-gray-500">
                Fill warehouse transfer details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product
              </label>
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - {product.sku}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From Warehouse
              </label>
              <select
                name="fromWarehouse"
                value={formData.fromWarehouse}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name} - {warehouse.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To Warehouse
              </label>
              <select
                name="toWarehouse"
                value={formData.toWarehouse}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name} - {warehouse.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className={`${inputClass} h-auto py-3 resize-none`}
                placeholder="Transfer notes..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100">
            <Link to="/inventory/transfers">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Save size={18} />
              {loading ? "Creating..." : "Create Transfer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateTransfer;