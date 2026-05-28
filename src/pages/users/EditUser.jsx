import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";

import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Breadcrumb from "../../components/UI/Breadcrumb";
import { Input, Select, FormGroup } from "../../components/UI/FormElements";
import { useToast } from "../../components/UI/Toast";
import { getCompanyUserById, updateCompanyUser } from "../../services/api";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff",
    isActive: true,
  });

  const fetchUser = async () => {
    try {
      const res = await getCompanyUserById(id);
      const user = res.data.user;

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "staff",
        isActive: user.isActive !== false,
      });
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateCompanyUser(id, {
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive,
      });

      toast.success("Updated", "User updated successfully");
      navigate("/users");
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to update user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Users", path: "/users" },
          { label: "Edit User" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Edit Team Member</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update manager or staff access.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormGroup label="Full Name">
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup label="Email">
            <Input value={formData.email} disabled />
          </FormGroup>

          <FormGroup label="Phone">
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup label="Role">
            <Select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              options={[
                { label: "Manager", value: "manager" },
                { label: "Staff", value: "staff" },
              ]}
            />
          </FormGroup>

          <FormGroup label="Status">
            <Select
              value={formData.isActive ? "active" : "inactive"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isActive: e.target.value === "active",
                })
              }
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          </FormGroup>

          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate("/users")}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              <Save size={16} />
              {loading ? "Updating..." : "Update User"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditUser;