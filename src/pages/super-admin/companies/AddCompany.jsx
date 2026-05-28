import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Landmark,
} from "lucide-react";
import api from "../../../services/api";

import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";
import { Input, FormGroup } from "../../../components/UI/FormElements";
import Textarea from "../../../components/UI/Textarea";
import { useToast } from "../../../components/UI/Toast";

const AddCompany = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    companyName: "",
    companyType: "General",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    gstNumber: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const companyTypes = [
    "Retail",
    "Manufacturing",
    "Warehouse",
    "Distributor",
    "Pharmacy",
    "Grocery",
    "General",
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/super-admin/create-company", form);

      toast.success(
        "Company Created",
        "Company and admin created successfully",
      );

      navigate("/super-admin/companies");
    } catch (error) {
      toast.error(
        "Creation Failed",
        error.response?.data?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <Breadcrumb
        items={[
          {
            label: "Super Admin",
            path: "/super-admin/dashboard",
          },
          {
            label: "Companies",
            path: "/super-admin/companies",
          },
          {
            label: "Add Company",
          },
        ]}
      />

      <div className="mt-5">
        <h1 className="text-2xl font-bold text-slate-800">Add New Company</h1>

        <p className="text-slate-500 mt-1">
          Create company and assign company admin access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Building2 size={22} className="text-blue-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Company Information
              </h2>

              <p className="text-sm text-slate-500">Basic company details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormGroup label="Company Name">
              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </FormGroup>

            <FormGroup label="Company Type">
              <select
                name="companyType"
                value={form.companyType}
                onChange={handleChange}
                className="
                            w-full
                            h-[45px]
                            
                            border
                            border-slate-200
                            bg-[#fafafa]
                            px-4
                            text-[15px]
                            text-slate-700
                            outline-none
                            transition-all
                            focus:border-blue-500
                            focus:ring-4
                            focus:ring-blue-100
                                                  "
              >
                {companyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="Owner Name">
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                  placeholder="Owner name"
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </FormGroup>

            <FormGroup label="Company Email">
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="company@email.com"
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </FormGroup>

            <FormGroup label="Phone Number">
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </FormGroup>

            <FormGroup label="GST Number">
              <div className="relative">
                <Landmark
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={handleChange}
                  placeholder="GST number"
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </FormGroup>

            <FormGroup label="City">
              <Input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
              />
            </FormGroup>

            <FormGroup label="State">
              <Input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
              />
            </FormGroup>

            <div className="md:col-span-2">
              <FormGroup label="Address">
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <Textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Company address"
                    style={{ paddingLeft: 44 }}
                  />
                </div>
              </FormGroup>
            </div>
          </div>
        </Card>

        <Card className="p-6 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <ShieldCheck size={22} className="text-emerald-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Company Admin Access
              </h2>

              <p className="text-sm text-slate-500">
                Create admin login credentials
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormGroup label="Admin Name">
              <Input
                name="adminName"
                value={form.adminName}
                onChange={handleChange}
                placeholder="Admin name"
              />
            </FormGroup>

            <FormGroup label="Admin Email">
              <Input
                type="email"
                name="adminEmail"
                value={form.adminEmail}
                onChange={handleChange}
                placeholder="admin@email.com"
              />
            </FormGroup>

            <FormGroup label="Admin Password">
              <Input
                type="password"
                name="adminPassword"
                value={form.adminPassword}
                onChange={handleChange}
                placeholder="******"
              />
            </FormGroup>
          </div>

          <div className="flex justify-end mt-8">
            <Button type="submit" disabled={loading} className="min-w-[180px]">
              {loading ? "Creating..." : "Create Company"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default AddCompany;
