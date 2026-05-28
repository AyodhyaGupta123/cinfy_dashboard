import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, PlusCircle, ShieldCheck, Users } from "lucide-react";
import api from "../../services/api";

import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import StatCard from "../../components/UI/StatCard";
import Breadcrumb from "../../components/UI/Breadcrumb";
import { useToast } from "../../components/UI/Toast";

const SuperAdminDashboard = () => {
  const toast = useToast();

  const [stats, setStats] = useState({
    totalCompanies: 0,
    companyAdmins: 0,
    activeCompanies: 0,
  });

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/super-admin/companies");
      const companies = res.data.companies || [];

      setStats({
        totalCompanies: companies.length,
        companyAdmins: companies.length,
        activeCompanies: companies.filter(
          (company) => company.status === "active"
        ).length,
      });
    } catch (error) {
      toast.error(
        "Failed to Fetch",
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb
        items={[
          { label: "Super Admin", path: "/super-admin/dashboard" },
          { label: "Dashboard" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Super Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Create companies, manage company admins and control company access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Total Companies"
          value={stats.totalCompanies}
          icon={Building2}
          color="blue"
        />

        <StatCard
          title="Company Admins"
          value={stats.companyAdmins}
          icon={Users}
          color="green"
        />

        <StatCard
          title="Active Companies"
          value={stats.activeCompanies}
          icon={ShieldCheck}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <Building2 size={24} className="text-slate-700" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Companies
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                View all registered companies and their status.
              </p>

              <Link to="/super-admin/companies">
                <Button className="mt-5">View Companies</Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <PlusCircle size={24} className="text-blue-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Add Company
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Create a company with company type and admin login.
              </p>

              <Link to="/super-admin/companies/add">
                <Button className="mt-5">Add Company</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;