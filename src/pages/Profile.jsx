import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit3,
  Shield,
  Key,
  Clock,
  CheckCircle,
  Calendar,
} from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import { Input, Select } from "../components/UI/FormElements";
import Badge from "../components/UI/Badge";
import Tabs from "../components/UI/Tabs";
import Avatar from "../components/UI/Avatar";
import Breadcrumb from "../components/UI/Breadcrumb";
import Textarea from "../components/UI/Textarea";
import FileUpload from "../components/UI/FileUpload";
import Tooltip from "../components/UI/Tooltip";
import { useToast } from "../components/UI/Toast";
import { theme } from "../theme/constants";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const ACTIVITY_LOG = [
  {
    time: "2 hours ago",
    action: "Logged into inventory dashboard",
    type: "Auth",
  },
  { time: "5 hours ago", action: "Viewed inventory reports", type: "Reports" },
  { time: "1 day ago", action: "Updated product details", type: "Products" },
  { time: "2 days ago", action: "Added stock inward entry", type: "Stock" },
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editModal, setEditModal] = useState(false);
  const [changePassModal, setChangePassModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    bio: "",
    company: "",
    role: "",
    pubId: "",
    joined: "",
    timezone: "",
    language: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        website: user.website || "",
        bio: user.bio || "",
        company: user.company || "Generic Inventory",
        role: user.role || "staff",
        pubId: user._id || user.id || "",
        joined: user.createdAt ? new Date(user.createdAt).toDateString() : "",
        timezone: "Asia/Kolkata (UTC+5:30)",
        language: "English",
      });
    }
  }, [user]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

const handleSaveProfile = async () => {
  try {
    const res = await api.put("/auth/profile", formData);

    if (res?.data?.user) {
      updateUser(res.data.user);
    }

    setEditModal(false);

    toast.success(
      "Profile Updated",
      res?.data?.message || "Your profile has been saved successfully."
    );
  } catch (error) {
    console.log("Profile update error:", error);

    toast.error(
      "Update Failed",
      error.response?.data?.message ||
        error.message ||
        "Something went wrong"
    );
  }
};

  const handleChangePass = () => {
    setChangePassModal(false);
    toast.success("Password Changed", "Your password has been updated.");
  };

  const ProfileTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: theme.textPrimary,
            }}
          >
            Personal Info
          </span>

          <Button
            variant="ghost"
            onClick={() => setEditModal(true)}
            style={{
              padding: "6px 14px",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Edit3 style={{ width: 13, height: 13 }} /> Edit
          </Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: User, label: "Full Name", value: formData.name },
            { icon: Mail, label: "Email", value: formData.email },
            { icon: Phone, label: "Phone", value: formData.phone },
            { icon: MapPin, label: "Location", value: formData.location },
            { icon: Globe, label: "Website", value: formData.website },
          ].map((item, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <item.icon
                  style={{ width: 15, height: 15, color: theme.textMuted }}
                />
              </div>

              <div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: theme.textPrimary,
                  }}
                >
                  {item.value || "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: theme.textPrimary,
            marginBottom: 20,
            display: "block",
          }}
        >
          Account Details
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: Shield, label: "Role", value: formData.role, badge: true },
            { icon: Key, label: "User ID", value: formData.pubId },
            { icon: Calendar, label: "Member Since", value: formData.joined },
            { icon: Clock, label: "Timezone", value: formData.timezone },
            { icon: Globe, label: "Language", value: formData.language },
          ].map((item, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <item.icon
                  style={{ width: 15, height: 15, color: theme.textMuted }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: theme.textMuted }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: theme.textPrimary,
                  }}
                >
                  {item.value || "-"}
                </div>
              </div>

              {item.badge && <Badge variant="success">{formData.role}</Badge>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <Button
            variant="ghost"
            onClick={() => setChangePassModal(true)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Key style={{ width: 14, height: 14 }} /> Change Password
          </Button>
        </div>
      </Card>

      <Card style={{ gridColumn: "1 / -1" }}>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: theme.textPrimary,
            marginBottom: 8,
            display: "block",
          }}
        >
          Bio
        </span>

        <p
          style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.7 }}
        >
          {formData.bio || "No bio added yet."}
        </p>
      </Card>
    </div>
  );

  const ActivityTab = () => (
    <Card>
      <span
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: theme.textPrimary,
          marginBottom: 16,
          display: "block",
        }}
      >
        Recent Activity
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {ACTIVITY_LOG.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 0",
              borderBottom:
                i < ACTIVITY_LOG.length - 1 ? "1px solid #f0f0f0" : "none",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: theme.primary,
                flexShrink: 0,
              }}
            />

            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, color: theme.textPrimary }}>
                {a.action}
              </span>
            </div>

            <Badge variant="default">{a.type}</Badge>

            <span
              style={{
                fontSize: 12,
                color: theme.textLight,
                whiteSpace: "nowrap",
              }}
            >
              {a.time}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Dashboard", path: "/" }, { label: "Profile" }]}
      />

      <Card className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 mb-6">
        <Tooltip text="Click to change avatar" position="bottom">
          <div
            onClick={() => setAvatarModal(true)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <Avatar
              name={formData.name || "User"}
              size="xl"
              color={theme.primary}
            />
          </div>
        </Tooltip>

        <div className="flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: theme.textPrimary,
                margin: 0,
              }}
            >
              {formData.name || "User"}
            </h1>

            <CheckCircle
              style={{ width: 18, height: 18, color: theme.primary }}
            />
          </div>

          <p style={{ fontSize: 14, color: theme.textMuted, marginTop: 4 }}>
            {formData.company || "Generic Inventory"} ·{" "}
            {formData.role || "staff"}
          </p>

          <p style={{ fontSize: 13, color: theme.textLight, marginTop: 2 }}>
            {formData.email}
          </p>
        </div>

        <Button
          variant="primary"
          className="w-full sm:w-auto justify-center"
          onClick={() => setEditModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Edit3 style={{ width: 14, height: 14 }} /> Edit Profile
        </Button>
      </Card>

      <Tabs
        tabs={[
          { label: "Profile", content: <ProfileTab /> },
          { label: "Activity", content: <ActivityTab /> },
        ]}
      />

      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Profile"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["Full Name", "name"],
              ["Email", "email"],
              ["Phone", "phone"],
              ["Location", "location"],
              ["Website", "website"],
              ["Company", "company"],
            ].map(([label, key]) => (
              <div key={key}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: theme.textSecondary,
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  {label}
                </label>

                <Input
                  value={formData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  disabled={key === "email"}
                  style={{ width: "100%" }}
                />
              </div>
            ))}
          </div>

          <Textarea
            label="Bio"
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={avatarModal}
        onClose={() => setAvatarModal(false)}
        title="Change Profile Photo"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAvatarModal(false)}>
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                setAvatarModal(false);
                toast.success("Avatar Updated", "Profile photo changed.");
              }}
            >
              Upload
            </Button>
          </>
        }
      >
        <FileUpload
          accept="image/*"
          maxSizeMB={5}
          label="Drop your photo here or click to browse"
          onFiles={(files) =>
            files.length && toast.info("Selected", files[0].name)
          }
        />
      </Modal>

      <Modal
        isOpen={changePassModal}
        onClose={() => setChangePassModal(false)}
        title="Change Password"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setChangePassModal(false)}>
              Cancel
            </Button>

            <Button variant="primary" onClick={handleChangePass}>
              Update Password
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
              Current Password
            </label>

            <Input
              type="password"
              placeholder="Enter current password"
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
              New Password
            </label>

            <Input
              type="password"
              placeholder="Enter new password"
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
              Confirm New Password
            </label>

            <Input
              type="password"
              placeholder="Confirm new password"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
