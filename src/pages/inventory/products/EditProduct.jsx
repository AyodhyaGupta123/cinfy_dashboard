import React from "react";
import { ArrowLeft, Save, Package } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Card from "../../../components/UI/Card";
import Button from "../../../components/UI/Button";
import Breadcrumb from "../../../components/UI/Breadcrumb";

const inputClass =
  "mt-2 w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const textareaClass =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const EditProduct = () => {
  const { id } = useParams();

  const product = {
    name: "Cotton Kurti",
    sku: "PRD-001",
    category: "Fashion",
    brand: "Kat Forever",
    purchasePrice: 850,
    sellingPrice: 1299,
    stock: 120,
    lowStockAlert: 10,
    status: "active",
    description: "Premium quality cotton kurti for daily and festive wear.",
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Inventory" },
          { label: "Products", path: "/inventory/products" },
          { label: "Edit Product" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-500 mt-1">
            Update product details. Product ID: {id}
          </p>
        </div>

        <Link to="/inventory/products">
          <Button variant="outline">
            <ArrowLeft size={18} />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Package size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Product Information
            </h2>
            <p className="text-sm text-gray-500">
              Edit product, price, stock and category details.
            </p>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              defaultValue={product.name}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              defaultValue={product.sku}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select defaultValue={product.category} className={inputClass}>
              <option value="Fashion">Fashion</option>
              <option value="Ethnic Wear">Ethnic Wear</option>
              <option value="Accessories">Accessories</option>
              <option value="Electronics">Electronics</option>
              <option value="Grocery">Grocery</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Brand</label>
            <select defaultValue={product.brand} className={inputClass}>
              <option value="Kat Forever">Kat Forever</option>
              <option value="Generic">Generic</option>
              <option value="Urban Style">Urban Style</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Purchase Price
            </label>
            <input
              type="number"
              defaultValue={product.purchasePrice}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Selling Price
            </label>
            <input
              type="number"
              defaultValue={product.sellingPrice}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Current Stock
            </label>
            <input
              type="number"
              defaultValue={product.stock}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Low Stock Alert
            </label>
            <input
              type="number"
              defaultValue={product.lowStockAlert}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select defaultValue={product.status} className={inputClass}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Unit Type
            </label>
            <select defaultValue="pcs" className={inputClass}>
              <option value="pcs">PCS</option>
              <option value="kg">KG</option>
              <option value="ltr">LTR</option>
              <option value="box">Box</option>
              <option value="packet">Packet</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows="4"
              defaultValue={product.description}
              className={textareaClass}
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Link to="/inventory/products">
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>

            <Button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white">
              <Save size={18} />
              Update Product
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProduct;