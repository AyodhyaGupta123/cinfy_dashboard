import React, { useEffect, useState } from "react";
import { ArrowLeft, Save, PackageMinus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import api from "../../../services/api";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100";

const AddStockOut = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    reason: "Sales Order",
    referenceNo: "",
    notes: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");

      if (res.data.success) {
        setProducts(res.data.products || []);
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load products"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const selectedProduct = products.find(
    (item) => item._id === formData.product
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.product) {
      toast.error("Validation Error", "Please select product.");
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.error("Validation Error", "Quantity must be greater than 0.");
      return;
    }

    if (
      selectedProduct &&
      Number(formData.quantity) > Number(selectedProduct.currentStock || 0)
    ) {
      toast.error(
        "Stock Error",
        `Only ${selectedProduct.currentStock || 0} stock available.`
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        product: formData.product,
        quantity: Number(formData.quantity),
        reason: formData.reason,
        referenceNo: formData.referenceNo,
        notes: formData.notes,
      };

      const res = await api.post("/stock/out", payload);

      if (res.data.success) {
        toast.success("Stock Removed", "Stock out created successfully.");
        navigate("/inventory/stock-out");
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
          { label: "Inventory" },
          { label: "Stock Out", path: "/inventory/stock-out" },
          { label: "Add Stock Out" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Add Stock Out
          </h1>
          <p className="text-gray-500 mt-1">
            Remove outgoing stock from inventory.
          </p>
        </div>

        <Link to="/inventory/stock-out">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <PackageMinus size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Stock Out Details
            </h2>
            <p className="text-sm text-gray-500">
              Enter stock outgoing information.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div>
            <label className="text-sm font-medium text-gray-700">
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
                  {product.name} - {product.sku} | Stock:{" "}
                  {product.currentStock || 0}
                </option>
              ))}
            </select>

            {selectedProduct && (
              <p className="mt-2 text-xs text-gray-500">
                Available Stock:{" "}
                <span className="font-semibold text-gray-900">
                  {selectedProduct.currentStock || 0}
                </span>
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Reason
            </label>

            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Sales Order">Sales Order</option>
              <option value="Damaged">Damaged</option>
              <option value="Manual Issue">Manual Issue</option>
              <option value="Expired">Expired</option>
              <option value="Lost">Lost</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Reference No
            </label>

            <input
              type="text"
              name="referenceNo"
              placeholder="Order / Bill / Manual Ref"
              value={formData.referenceNo}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Notes
            </label>

            <textarea
              name="notes"
              rows="4"
              placeholder="Write notes..."
              value={formData.notes}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <Link to="/inventory/stock-out">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Stock Out"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddStockOut;