import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  FileText,
  BarChart2,
  Calendar,
  Database,
} from "lucide-react";

import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Breadcrumb from "../components/UI/Breadcrumb";
import { Input, Select, FormGroup } from "../components/UI/FormElements";
import { useToast } from "../components/UI/Toast";
import { theme } from "../theme/constants";
import api from "../services/api";

const CreateReport = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    schedule: "",
    lastRun: "",
    status: "Scheduled",
    rows: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "rows" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Validation Error", "Report name is required.");
      return;
    }

    if (!formData.type) {
      toast.error("Validation Error", "Report type is required.");
      return;
    }

    if (!formData.schedule) {
      toast.error("Validation Error", "Report schedule is required.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/reports", formData);

      toast.success("Report Created", "Report created successfully.");
      navigate("/custom-reports");
    } catch (error) {
      toast.error(
        "Create Failed",
        error.response?.data?.message || "Failed to create report"
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
          { label: "Custom Reports", path: "/reports" },
          { label: "Create Report" },
        ]}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1
            style={{
              fontSize: theme.fontSizeH1,
              fontWeight: theme.fontWeightBold,
              color: theme.textPrimary,
            }}
          >
            Create Report
          </h1>

          <p style={{ color: theme.textMuted, marginTop: 4 }}>
            Create a custom report with schedule and status.
          </p>
        </div>

        <Link to="/reports" className="w-full sm:w-auto">
          <Button
            variant="ghost"
            className="w-full sm:w-auto justify-center"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Back to Reports
          </Button>
        </Link>
      </div>

      <Card style={{ padding: 22 }}>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              paddingBottom: 18,
              marginBottom: 20,
              borderBottom: "1px solid #eef2f7",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: theme.primaryLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText style={{ width: 20, height: 20, color: theme.primary }} />
            </div>

            <div>
              <h2
                style={{
                  fontSize: theme.fontSizeH2,
                  fontWeight: theme.fontWeightBold,
                  color: theme.textPrimary,
                }}
              >
                Report Information
              </h2>

              <p style={{ color: theme.textMuted, fontSize: theme.fontSizeMuted }}>
                Fill report details below.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 18,
            }}
          >
            <FormGroup label="Report Name">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter report name"
              />
            </FormGroup>

            <FormGroup label="Report Type">
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { label: "Select report type", value: "" },
                  { label: "Revenue", value: "Revenue" },
                  { label: "Performance", value: "Performance" },
                  { label: "Analytics", value: "Analytics" },
                  { label: "Ads", value: "Ads" },
                ]}
              />
            </FormGroup>

            <FormGroup label="Schedule">
              <Select
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                options={[
                  { label: "Select schedule", value: "" },
                  { label: "Daily", value: "Daily" },
                  { label: "Weekly", value: "Weekly" },
                  { label: "Monthly", value: "Monthly" },
                ]}
              />
            </FormGroup>

            <FormGroup label="Status">
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { label: "Scheduled", value: "Scheduled" },
                  { label: "Running", value: "Running" },
                  { label: "Completed", value: "Completed" },
                ]}
              />
            </FormGroup>

            <FormGroup label="Last Run Date">
              <Input
                type="date"
                name="lastRun"
                value={formData.lastRun}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup label="Rows">
              <Input
                type="number"
                name="rows"
                min="0"
                value={formData.rows}
                onChange={handleChange}
                placeholder="Enter rows count"
              />
            </FormGroup>
          </div>

          <div
            style={{
              marginTop: 26,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            <Card
              style={{
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: theme.primaryLight,
              }}
            >
              <BarChart2 style={{ width: 18, height: 18, color: theme.primary }} />
              <span style={{ fontWeight: 600, color: theme.textPrimary }}>
                Analytics Ready
              </span>
            </Card>

            <Card
              style={{
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(249,115,22,0.08)",
              }}
            >
              <Calendar style={{ width: 18, height: 18, color: "#f97316" }} />
              <span style={{ fontWeight: 600, color: theme.textPrimary }}>
                Auto Schedule
              </span>
            </Card>

            <Card
              style={{
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(59,130,246,0.08)",
              }}
            >
              <Database style={{ width: 18, height: 18, color: "#3b82f6" }} />
              <span style={{ fontWeight: 600, color: theme.textPrimary }}>
                Dynamic Rows
              </span>
            </Card>
          </div>

          <div
            style={{
              marginTop: 28,
              paddingTop: 18,
              borderTop: "1px solid #eef2f7",
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link to="/reports">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Save style={{ width: 16, height: 16 }} />
              {loading ? "Saving..." : "Save Report"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateReport;