import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, ArrowLeftRight } from "lucide-react";
import Card from "../../../../components/UI/Card";
import Button from "../../../../components/UI/Button";
import Breadcrumb from "../../../../components/UI/Breadcrumb";
import { useToast } from "../../../../components/UI/Toast";
import api from "../../../../services/api";

const inputClass =
  "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const EditTransfer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState({
    status: "pending",
    notes: "",
  });

  const fetchTransfer = async () => {
    try {
      setFetching(true);

      const res = await api.get(`/transfers/${id}`);

      if (res.data.success) {
        const transfer = res.data.transfer;

        setFormData({
          status: transfer.status || "pending",
          notes: transfer.notes || "",
        });
      }
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to load transfer"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTransfer();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.put(`/transfers/${id}/status`, formData);

      if (res.data.success) {
        toast.success("Updated", "Transfer updated successfully.");
        navigate("/inventory/transfers");
      }
    } catch (error) {
      toast.error(
        "Update Failed",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-6 text-gray-500">Loading transfer...</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Warehouse" },
          { label: "Transfers", path: "/inventory/transfers" },
          { label: "Edit Transfer" },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Transfer</h1>
          <p className="text-gray-500 mt-1">
            Update transfer status and notes.
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
                Transfer Status
              </h2>
              <p className="text-sm text-gray-500">
                Change current transfer status.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              {loading ? "Updating..." : "Update Transfer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditTransfer;