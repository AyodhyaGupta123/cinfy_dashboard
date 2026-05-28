import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit3, Trash2, Shield, ShieldAlert, Key } from "lucide-react";

import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import Table from "../../components/UI/Table";
import Badge from "../../components/UI/Badge";
import Avatar from "../../components/UI/Avatar";
import DropdownMenu from "../../components/UI/DropdownMenu";
import ConfirmDialog from "../../components/UI/ConfirmDialog";
import Pagination from "../../components/UI/Pagination";
import Breadcrumb from "../../components/UI/Breadcrumb";
import {
  Input,
  Select,
  FormGroup,
  SearchInput,
} from "../../components/UI/FormElements";
import { useToast } from "../../components/UI/Toast";
import { theme } from "../../theme/constants";

import {
  getCompanyUsers,
  createStaffUser,
  deleteCompanyUser,
} from "../../services/api";

const PER_PAGE = 5;

const Users = () => {
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const [addModal, setAddModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "staff",
  });

  const fetchUsers = async () => {
    try {
      const res = await getCompanyUsers();
      setUsers(res.data.users || []);
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const name = u.name || "";
    const email = u.email || "";
    const role = u.role || "";

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" || role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / PER_PAGE) || 1;
  const paged = filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Validation Error", "Name, email and password are required");
      return;
    }

    try {
      await createStaffUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      toast.success("User Created", `${formData.name} added successfully`);

      setAddModal(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "staff",
      });

      fetchUsers();
    } catch (error) {
      toast.error(
        "Failed",
        error.response?.data?.message || "Failed to create user",
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteCompanyUser(selectedUser._id);

      toast.success(
        "User Removed",
        `${selectedUser.name} has been removed successfully.`,
      );

      setSelectedUser(null);
      setDeleteDialog(false);
      fetchUsers();
    } catch (error) {
      toast.error(
        "Delete Failed",
        error.response?.data?.message || "Failed to delete user",
      );
    }
  };

  const roleStyles = {
    admin: {
      bg: "rgba(239,68,68,0.1)",
      color: "#ef4444",
    },
    manager: {
      bg: "rgba(59,130,246,0.1)",
      color: "#3b82f6",
    },
    staff: {
      bg: "rgba(16,185,129,0.1)",
      color: "#10b981",
    },
  };

  const statusVariants = {
    active: "success",
    inactive: "default",
  };

  const columns = [
    {
      header: "User",
      accessor: "name",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={row.name} size="md" />

          <div>
            <div
              style={{
                fontWeight: 600,
                color: theme.textPrimary,
              }}
            >
              {row.name}
            </div>

            <div
              style={{
                fontSize: 13,
                color: theme.textMuted,
              }}
            >
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      render: (row) => {
        const role = row.role?.toLowerCase();
        const style = roleStyles[role] || roleStyles.staff;

        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              background: style.bg,
              color: style.color,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              textTransform: "capitalize",
            }}
          >
            {role === "admin" ? (
              <ShieldAlert style={{ width: 12, height: 12 }} />
            ) : (
              <Shield style={{ width: 12, height: 12 }} />
            )}

            {row.role}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const isActive = row.isActive !== false;
        const status = isActive ? "active" : "inactive";

        return (
          <Badge variant={statusVariants[status]}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      header: "Phone",
      accessor: "phone",
      render: (row) => row.phone || "N/A",
    },
    {
      header: "Created",
      accessor: "createdAt",
      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
    },
    {
      header: "",
      accessor: "actions",
      render: (row) => (
        <DropdownMenu
          items={[
            {
              icon: Edit3,
              label: "Edit User",
              onClick: () => navigate(`/users/edit/${row._id}`),
            },
            {
              icon: Key,
              label: "Reset Password",
              onClick: () =>
                toast.success("Sent", "Password reset email sent."),
            },
            {
              divider: true,
            },
            {
              icon: Trash2,
              label: "Remove User",
              danger: true,
              onClick: () => {
                setSelectedUser(row);
                setDeleteDialog(true);
              },
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Dashboard", path: "/" }, { label: "Team Members" }]}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: theme.textPrimary,
              marginBottom: 4,
            }}
          >
            Team Members
          </h1>

          <p
            style={{
              fontSize: 14,
              color: theme.textMuted,
            }}
          >
            Manage your company staff and manager access.
          </p>
        </div>

        <Button onClick={() => navigate("/users/add")}>
          <Plus style={{ width: 16, height: 16 }} />
          Add Member
        </Button>
      </div>

      <Card>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginBottom: 16,
            alignItems: "end",
          }}
        >
          <FormGroup label="Search">
            <SearchInput
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              style={{ width: "100%" }}
            />
          </FormGroup>

          <FormGroup label="Role">
            <Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              options={[
                { label: "All Roles", value: "all" },
                { label: "Manager", value: "manager" },
                { label: "Staff", value: "staff" },
              ]}
              style={{ width: "100%" }}
            />
          </FormGroup>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          data={paged}
          emptyMessage="No team members found."
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filteredUsers.length}
          perPage={PER_PAGE}
        />
      </Card>

      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="Add Team Member"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddModal(false)}>
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleAddUser}
              disabled={!formData.name || !formData.email || !formData.password}
            >
              Create User
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.textSecondary,
                marginBottom: 6,
                display: "block",
              }}
            >
              Full Name
            </label>

            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="e.g. John Doe"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.textSecondary,
                marginBottom: 6,
                display: "block",
              }}
            >
              Email Address
            </label>

            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              placeholder="john@example.com"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.textSecondary,
                marginBottom: 6,
                display: "block",
              }}
            >
              Phone
            </label>

            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              placeholder="Phone number"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.textSecondary,
                marginBottom: 6,
                display: "block",
              }}
            >
              Password
            </label>

            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              placeholder="Minimum 6 characters"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.textSecondary,
                marginBottom: 6,
                display: "block",
              }}
            >
              Role
            </label>

            <Select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value,
                })
              }
              options={[
                { label: "Manager", value: "manager" },
                { label: "Staff", value: "staff" },
              ]}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        type="delete"
        title={`Remove ${selectedUser?.name}?`}
        message="This user will lose access to the platform immediately. Are you sure?"
        confirmLabel="Remove User"
      />
    </div>
  );
};

export default Users;
