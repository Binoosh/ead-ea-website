import { useState } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { createEVOwner } from "../../../services/evOwnersService";
import {
  IDCardIcon,
  LockIcon,
  CarIcon,
  SaveIcon,
  UserIcon,
  LoadingSpinner,
} from "../../../components/icons/Icons";

export default function RegisterEvOwners() {
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
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const fieldGroups = {
    basic: ["firstName", "lastName", "nic"],
    vehicle: ["vehicleType", "vehicleNumber"],
    security: ["passwordHash"],
  };

  const validateStep = (fields) => {
    const errors = {};
    fields.forEach((field) => {
      if (!form[field] || form[field].trim() === "") {
        errors[field] = "This field is required.";
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => {
    if (step === 1 && validateStep(fieldGroups.basic)) setStep(2);
    else if (step === 2 && validateStep(fieldGroups.vehicle)) setStep(3);
    else if (step === 3 && validateStep(fieldGroups.security)) setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createEVOwner(form);
      setSubmittedData(form);
      Swal.fire({
        title: "Owner Registered Successfully!",
        text: "The EV owner has been added to the system.",
        icon: "success",
        confirmButtonColor: "#0ea5e9",
        background: "#ffffff",
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
      setStep(1);
    } catch (err) {
      Swal.fire({
        title: "Registration Failed",
        text: err.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderProgress = () => {
    const steps = ["Basic Info", "Vehicle Info", "Security", "Review"];
    return (
      <div className="flex justify-between items-center mb-6">
        {steps.map((s, i) => {
          const current = i + 1;
          return (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                  step >= current
                    ? "bg-sky-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {current}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 ${
                    step > current ? "bg-sky-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const InputField = ({
    label,
    name,
    placeholder,
    icon,
    type = "text",
    value,
    onChange,
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 ${
            validationErrors[name]
              ? "border-red-500"
              : "border-gray-300 hover:border-gray-400"
          }`}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          {icon}
        </div>
      </div>
      {validationErrors[name] && (
        <p className="text-sm text-red-500">{validationErrors[name]}</p>
      )}
    </div>
  );

  return (
    <DashboardLayout title="Register EV Owner">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-sky-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <h1 className="text-2xl font-bold">EV Owner Registration</h1>
          <p className="text-sky-100">
            Complete each step to register a new EV owner account.
          </p>
        </div>

        <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-8 space-y-6">
          {renderProgress()}

          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <UserIcon /> Basic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="First Name"
                  name="firstName"
                  placeholder="Enter first name"
                  icon={<UserIcon />}
                  value={form.firstName}
                  onChange={handleChange}
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter last name"
                  icon={<UserIcon />}
                  value={form.lastName}
                  onChange={handleChange}
                />
                <InputField
                  label="NIC Number"
                  name="nic"
                  placeholder="Enter NIC number"
                  icon={<IDCardIcon />}
                  value={form.nic}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CarIcon /> Vehicle Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Vehicle Type"
                  name="vehicleType"
                  placeholder="e.g., Tesla Model 3"
                  icon={<CarIcon />}
                  value={form.vehicleType}
                  onChange={handleChange}
                />
                <InputField
                  label="Vehicle Number"
                  name="vehicleNumber"
                  placeholder="e.g., ABC-1234"
                  icon={<CarIcon />}
                  value={form.vehicleNumber}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <LockIcon /> Security Setup
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="passwordHash"
                      value={form.passwordHash}
                      onChange={handleChange}
                      placeholder="Enter secure password"
                      className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 ${
                        validationErrors.passwordHash
                          ? "border-red-500"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <LockIcon />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 text-sm text-gray-500 hover:text-sky-600"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {validationErrors.passwordHash && (
                    <p className="text-sm text-red-500">
                      {validationErrors.passwordHash}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 w-full">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">
                      Account Status
                    </h4>
                    <p className="text-xs text-gray-500">
                      Enable or disable owner access
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {form.isActive ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <SaveIcon /> Review & Confirm
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Name:</span> {form.firstName}{" "}
                    {form.lastName}
                  </p>
                  <p>
                    <span className="font-semibold">NIC:</span> {form.nic}
                  </p>
                  <p>
                    <span className="font-semibold">Vehicle Type:</span>{" "}
                    {form.vehicleType}
                  </p>
                  <p>
                    <span className="font-semibold">Vehicle No:</span>{" "}
                    {form.vehicleNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {form.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-medium"
              >
                ← Back
              </button>
            )}
            {step < 4 && (
              <button
                onClick={handleNext}
                className="ml-auto bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
              >
                Next →
              </button>
            )}
            {step === 4 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto flex items-center gap-2 bg-gradient-to-r from-sky-500 to-green-600 text-white px-8 py-3.5 rounded-lg font-semibold shadow-md hover:scale-105 transform transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoadingSpinner /> <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <SaveIcon /> <span>Register Owner</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {submittedData && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h3 className="font-semibold text-green-900 mb-2">
              Registration Summary
            </h3>
            <p className="text-sm text-green-700">
              EV Owner {submittedData.firstName} {submittedData.lastName} was
              successfully registered with NIC {submittedData.nic}. Vehicle:{" "}
              {submittedData.vehicleType} ({submittedData.vehicleNumber}).
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
