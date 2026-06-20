import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Plus,
  Eye,
  Trash2,
  BarChart2,
  RefreshCw,
  MoreVertical,
} from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Table from "../components/UI/Table";
import { Select, FormGroup } from "../components/UI/FormElements";
import Badge from "../components/UI/Badge";
import Breadcrumb from "../components/UI/Breadcrumb";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import { useToast } from "../components/UI/Toast";
import { theme } from "../theme/constants";
import api from "../services/api";

const TYPE_OPTIONS = [
  { label: "All Types", value: "all" },
  { label: "Revenue", value: "revenue" },
  { label: "Performance", value: "performance" },
  { label: "Analytics", value: "analytics" },
  { label: "Ads", value: "ads" },
];

const SCHEDULE_OPTIONS = [
  { label: "All Schedules", value: "all" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const STATUS_VARIANT = {
  Completed: "success",
  Running: "info",
  Scheduled: "warning",
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ActionMenu = ({ row, onView, onDownload, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.right + window.scrollX - 176,
    });

    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedButton = buttonRef.current?.contains(e.target);
      const clickedMenu = menuRef.current?.contains(e.target);

      if (!clickedButton && !clickedMenu) {
        setOpen(false);
      }
    };

    const handleClose = () => setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="h-9 w-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      >
        <MoreVertical size={17} className="mx-auto" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              zIndex: 99999,
            }}
            className="w-44 rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onView(row);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye size={15} />
              View Report
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onDownload(row);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Download size={15} />
              Download
            </button>

            <div className="my-1 border-t border-gray-100" />

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onDelete(row);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>,
          document.body,
        )}
    </>
  );
};

const SummaryCard = ({ icon: Icon, label, value, color }) => (
  <Card
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 18px",
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: `${color}14`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon style={{ width: 18, height: 18, color }} />
    </div>

    <div>
      <div
        style={{
          fontSize: theme.fontSizeH2,
          fontWeight: theme.fontWeightBold,
          color: theme.textPrimary,
        }}
      >
        {value}
      </div>

      <div style={{ fontSize: theme.fontSizeMuted, color: theme.textMuted }}>
        {label}
      </div>
    </div>
  </Card>
);

const CustomReports = () => {
  const toast = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [filters, setFilters] = useState({
    type: "all",
    schedule: "all",
  });

  const fetchReports = async () => {
    try {
      setLoading(true);

      const res = await api.get("/reports");

      setReports(res.data.data?.reports || []);
    } catch (error) {
      toast.error(
        "Load Failed",
        error.response?.data?.message || "Failed to load reports",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    const list = Array.isArray(reports) ? reports : [];

    return list.filter((report) => {
      const typeMatch =
        filters.type === "all" ||
        report.type?.toLowerCase() === filters.type.toLowerCase();

      const scheduleMatch =
        filters.schedule === "all" ||
        report.schedule?.toLowerCase() === filters.schedule.toLowerCase();

      return typeMatch && scheduleMatch;
    });
  }, [reports, filters]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Total Reports",
        value: reports.length,
        icon: FileText,
        color: theme.primary,
      },
      {
        label: "Completed",
        value: reports.filter((item) => item.status === "Completed").length,
        icon: BarChart2,
        color: "#16a34a",
      },
      {
        label: "Running",
        value: reports.filter((item) => item.status === "Running").length,
        icon: Filter,
        color: "#3b82f6",
      },
      {
        label: "Scheduled",
        value: reports.filter((item) => item.status === "Scheduled").length,
        icon: Calendar,
        color: "#f97316",
      },
    ],
    [reports],
  );

  const handleDeleteReport = async () => {
    if (!selectedReport?._id) return;

    try {
      await api.delete(`/reports/${selectedReport._id}`);
      toast.success("Deleted", "Report deleted successfully.");
      setDeleteDialog(false);
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      toast.error(
        "Delete Failed",
        error.response?.data?.message || "Failed to delete report",
      );
    }
  };

  const columns = [
    {
      header: "Report Name",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            style={{ background: theme.primaryLight }}
            className="flex h-9 w-9 items-center justify-center rounded-lg"
          >
            <FileText style={{ width: 16, height: 16, color: theme.primary }} />
          </div>

          <span style={{ fontWeight: 600, color: theme.textPrimary }}>
            {row.name}
          </span>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      render: (row) => row.type || "-",
    },
    {
      header: "Schedule",
      accessor: "schedule",
      render: (row) => row.schedule || "-",
    },
    {
      header: "Last Run",
      accessor: "lastRun",
      render: (row) => formatDate(row.lastRun),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status] || "warning"}>
          {row.status || "Scheduled"}
        </Badge>
      ),
    },
    {
      header: "Rows",
      accessor: "rows",
      render: (row) => (
        <span style={{ fontWeight: 600, color: theme.textPrimary }}>
          {Number(row.rows || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <ActionMenu
          row={row}
          onView={(item) => toast.info("Viewing", item.name)}
          onDownload={(item) =>
            toast.success("Downloaded", `${item.name} exported.`)
          }
          onDelete={(item) => {
            setSelectedReport(item);
            setDeleteDialog(true);
          }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[{ label: "Dashboard", path: "/" }, { label: "Custom Reports" }]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1
          style={{
            fontSize: theme.fontSizeH1,
            fontWeight: theme.fontWeightBold,
            color: theme.textPrimary,
          }}
        >
          Custom Reports
        </h1>

        <Link to="/custom-reports/create" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full sm:w-auto">
            <Plus style={{ width: 16, height: 16 }} />
            Create Report
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((item) => (
          <SummaryCard key={item.label} {...item} />
        ))}
      </div>

      <Card>
        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <FormGroup label="Type">
            <Select
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
              options={TYPE_OPTIONS}
              style={{ width: "100%" }}
            />
          </FormGroup>

          <FormGroup label="Schedule">
            <Select
              value={filters.schedule}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, schedule: e.target.value }))
              }
              options={SCHEDULE_OPTIONS}
              style={{ width: "100%" }}
            />
          </FormGroup>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="ghost" onClick={fetchReports}>
              <RefreshCw style={{ width: 14, height: 14 }} />
              Refresh
            </Button>

            <Button
              variant="ghost"
              onClick={() => toast.success("Export", "Export started.")}
            >
              <Download style={{ width: 14, height: 14 }} />
              Export
            </Button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 30, textAlign: "center", color: theme.textMuted }}>
            Loading reports...
          </div>
        ) : (
          <Table
            rowKey="_id"
            columns={columns}
            data={filteredReports}
            emptyMessage="No reports found"
          />
        )}
      </Card>

      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => {
          setDeleteDialog(false);
          setSelectedReport(null);
        }}
        onConfirm={handleDeleteReport}
        type="delete"
        title={`Delete ${selectedReport?.name || "Report"}?`}
        message="This report and its data will be permanently deleted."
      />
    </div>
  );
};

export default CustomReports;