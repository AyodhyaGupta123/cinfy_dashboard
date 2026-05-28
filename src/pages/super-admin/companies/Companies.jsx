import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Plus, Mail, User, Tag } from "lucide-react";

import api from "../../../services/api";

import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import EmptyState from "../../../components/UI/EmptyState";
import { Skeleton } from "../../../components/UI/Skeleton";
import Table from "../../../components/UI/Table";
import { useToast } from "../../../components/UI/Toast";

const Companies = () => {
  const toast = useToast();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/super-admin/companies");
      setCompanies(res.data.companies || []);
    } catch (error) {
      toast.error(
        "Failed to Fetch",
        error.response?.data?.message || "Failed to fetch companies"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const columns = [
    { header: "Company", accessor: "company" },
    { header: "Type", accessor: "type" },
    { header: "Owner", accessor: "owner" },
    { header: "Email", accessor: "email" },
    { header: "Status", accessor: "status" },
  ];

  const tableData = useMemo(() => {
    return companies.map((company) => ({
      company: (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 size={18} className="text-blue-600" />
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              {company.companyName || "N/A"}
            </p>
            <p className="text-xs text-slate-500">
              {company.city || "N/A"}, {company.state || "N/A"}
            </p>
          </div>
        </div>
      ),

      type: (
        <div className="flex items-center gap-2 text-slate-600">
          <Tag size={16} />
          {company.companyType || "General"}
        </div>
      ),

      owner: (
        <div className="flex items-center gap-2 text-slate-600">
          <User size={16} />
          {company.ownerName || "N/A"}
        </div>
      ),

      email: (
        <div className="flex items-center gap-2 text-slate-600">
          <Mail size={16} />
          {company.email || "N/A"}
        </div>
      ),

      status: (
        <Badge
          variant={
            company.status === "active"
              ? "success"
              : company.status === "blocked"
              ? "danger"
              : "warning"
          }
        >
          {company.status || "inactive"}
        </Badge>
      ),
    }));
  }, [companies]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <Breadcrumb
        items={[
          { label: "Super Admin", path: "/super-admin/dashboard" },
          { label: "Companies" },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Companies</h1>
          <p className="text-sm text-slate-500 mt-1">
            All registered companies list.
          </p>
        </div>

        <Link to="/super-admin/companies/add">
          <Button>
            <Plus size={18} />
            Add Company
          </Button>
        </Link>
      </div>

      <Card className="p-0 mt-6 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : companies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No companies found"
            description="Start by creating your first company."
            action={
              <Link to="/super-admin/companies/add">
                <Button>
                  <Plus size={18} />
                  Add Company
                </Button>
              </Link>
            }
          />
        ) : (
          <Table columns={columns} data={tableData} />
        )}
      </Card>
    </div>
  );
};

export default Companies;