import Swal from "sweetalert2";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useState } from "react";
import { createEVOwner } from "../../../services/evOwnersService";
import {
  IDCardIcon,
  LoadingSpinner,
  LockIcon,
} from "../../../components/icons/Icons";
import { CarIcon, SaveIcon, UserIcon } from "../../../components/icons/Icons";

export default function AddEVOwners() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nic: "",
    vehicleType: "",
    vehicleNumber: "",
    isActive: true,
    passwordHash: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEVOwner(form);
      Swal.fire({
        title: "Success!",
        text: "EV Owner registered successfully",
        icon: "success",
        confirmButtonColor: "#8b5cf6",
        background: "#1f2937",
        color: "#f3f4f6"
      });
      setForm({
        firstName: "",
        lastName: "",
        nic: "",
        vehicleType: "",
        vehicleNumber: "",
        isActive: true,
        passwordHash: "",
      });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f3f4f6"
      });
    } finally {
      setLoading(false);
    }
  };

  const fieldConfig = [
    {
      name: "firstName",
      label: "First Name",
      icon: <UserIcon />,
      placeholder: "Enter first name",
    },
    {
      name: "lastName",
      label: "Last Name",
      icon: <UserIcon />,
      placeholder: "Enter last name",
    },
    {
      name: "nic",
      label: "NIC Number",
      icon: <IDCardIcon />,
      placeholder: "Enter NIC number",
    },
    {
      name: "vehicleType",
      label: "Vehicle Model",
      icon: <CarIcon />,
      placeholder: "e.g., Tesla Model 3, Nissan Leaf",
    },
    {
      name: "vehicleNumber",
      label: "License Plate",
      icon: <CarIcon />,
      placeholder: "Enter vehicle registration number",
    },
    {
      name: "passwordHash",
      label: "Access Code",
      icon: <LockIcon />,
      placeholder: "Set access code",
      type: "password",
    },
  ];

  return (
    <DashboardLayout title="Register EV Owner">
      <div className="mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-purple-600 to-amber-600 rounded-2xl shadow-2xl p-8 mb-8 text-white border border-purple-500/30">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
              <UserIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Register EV Driver</h1>
              <p className="text-purple-100 mt-2 text-lg">
                Add new electric vehicle owner to the charging network
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-700 bg-gray-900/50">
            <h2 className="text-xl font-semibold text-white flex items-center space-x-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <IDCardIcon />
              </div>
              <span>Driver Information</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fieldConfig.map((field) => (
                <div key={field.name} className="space-y-3">
                  <label className="flex items-center space-x-3 text-sm font-semibold text-gray-300">
                    <div className="p-2 bg-gray-700 rounded-lg">
                      {field.icon}
                    </div>
                    <span>{field.label}</span>
                  </label>
                  <div className="relative">
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-4 pl-12 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 hover:border-gray-500 text-white placeholder-gray-400"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-400">
                      {field.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-6 bg-gray-700/50 rounded-2xl border border-gray-600">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-600 rounded-xl border border-gray-500">
                  <svg
                    className="w-6 h-6 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <label className="block text-lg font-semibold text-white">
                    Account Status
                  </label>
                  <p className="text-sm text-gray-400">
                    Enable or disable this EV driver account
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
                <span className="ml-3 text-lg font-medium text-white">
                  {form.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-8">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-bold rounded-2xl shadow-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-amber-500/30"
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-3">Registering Driver...</span>
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    <span className="ml-3">Register EV Driver</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
              <svg
                className="w-6 h-6 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-amber-300 text-lg">Registration Guidelines</h3>
              <ul className="mt-3 text-amber-200/80 space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>Verify all driver information matches official documents</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>License plate must match vehicle registration certificate</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>Inactive accounts cannot access charging services</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <span>Set secure access codes for account protection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}