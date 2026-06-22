import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Ruler } from "lucide-react";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { useToast } from "../../../components/UI/Toast";
import { getUnitById, updateUnit } from "../../../services/api";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none";

const EditUnit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    unitType: "",
    description: "",
  });

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        setFetching(true);
        const res = await getUnitById(id);
        if (res.data.success) {
          const { name, abbreviation, unitType, description } = res.data.unit;
          setFormData({
            name: name || "",
            abbreviation: abbreviation || "",
            unitType: unitType || "",
            description: description || "",
          });
        }
      } catch (error) {
        toast.error(
          "Fetch Failed",
          error.response?.data?.message || "Could not load unit details."
        );
        navigate("/inventory/units");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchUnit();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Validation Error", "Unit name is required.");
      return;
    }

    if (!formData.abbreviation.trim()) {
      toast.error("Validation Error", "Unit abbreviation is required.");
      return;
    }

    try {
      setLoading(true);
      const res = await updateUnit(id, formData);
      if (res.data.success) {
        toast.success("Unit Updated", "Unit updated successfully.");
        navigate("/inventory/units");
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
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400">Loading unit details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Units", path: "/inventory/units" },
          { label: "Edit Unit" },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Edit Unit
          </h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Update the unit of measurement details.
          </p>
        </div>

        <Link to="/inventory/units" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 sm:h-12 sm:w-12">
            <Ruler size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Unit Information
            </h2>
            <p className="text-sm text-gray-500">Update unit details below.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div>
            <label className="text-sm font-medium text-gray-700">
              Unit Name <span className="text-red-500">*</span>
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter unit name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Unit Abbreviation <span className="text-red-500">*</span>
            </label>

            <input
              name="abbreviation"
              value={formData.abbreviation}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter abbreviation"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Unit Type
            </label>

            <select
              name="unitType"
              value={formData.unitType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select unit type</option>
              <option value="base">Base Unit</option>
              <option value="derived">Derived Unit</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Description <span className="text-gray-400">(Optional)</span>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={textareaClass}
              placeholder="Enter unit description"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <Link to="/inventory/units" className="w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-white hover:bg-emerald-600 sm:w-auto"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditUnit;