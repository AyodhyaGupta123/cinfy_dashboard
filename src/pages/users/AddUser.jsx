import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Breadcrumb from "../../components/UI/Breadcrumb";
import { Input, Select, FormGroup } from "../../components/UI/FormElements";
import { useToast } from "../../components/UI/Toast";
import { createStaffUser } from "../../services/api";

const AddUser = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "staff",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createStaffUser(formData);

      toast.success("User Created", "Team member created successfully");
      navigate("/users");
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to create user"
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
          { label: "Add User" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Add Team Member</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create manager or staff login for your company.
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
              placeholder="Enter full name"
            />
          </FormGroup>

          <FormGroup label="Email">
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email"
            />
          </FormGroup>

          <FormGroup label="Phone">
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Enter phone number"
            />
          </FormGroup>

          <FormGroup label="Password">
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Minimum 6 characters"
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

          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate("/users")}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              <UserPlus size={16} />
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddUser;