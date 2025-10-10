import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Button from "../../components/loading/Button";
import registercustomer from "../../assets/auth/register-customer.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { createEVOwner } from "../../services/evOwnersService";

export default function EVOwnerRegister() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nic: "",
    vehicleType: "",
    vehicleNumber: "",
    passwordHash: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!form.nic) {
      newErrors.nic = "NIC is required";
    } else if (form.nic.length < 10) {
      newErrors.nic = "Enter a valid NIC";
    }

    if (!form.vehicleType.trim()) {
      newErrors.vehicleType = "Vehicle type is required";
    }

    if (!form.vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle number is required";
    }

    if (!form.passwordHash) {
      newErrors.passwordHash = "Password is required";
    } else if (form.passwordHash.length < 6) {
      newErrors.passwordHash = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.passwordHash !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const data = await createEVOwner(form);

      Swal.fire({
        title: "Welcome to the Future!",
        text: `Welcome ${form.firstName}! Your EV journey begins now.`,
        icon: "success",
        confirmButtonColor: "#8b5cf6",
        background: "#1f2937",
        color: "#f3f4f6"
      }).then(() => {
        navigate("/login/ev-owner");
      });
    } catch (err) {
      // Show error alert
      Swal.fire({
        title: "Registration Failed",
        text: err.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f3f4f6"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative bg-gradient-to-br from-gray-900 to-purple-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900"></div>

      {/* Background Image for Mobile */}
      <div className="md:hidden absolute inset-0 z-0">
        <img
          src={registercustomer}
          alt="Register Background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      <div className="bg-gray-800/90 w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden min-h-[650px] z-10 border border-purple-500/30 backdrop-blur-sm">
        {/* Left Image Panel */}
        <div className="hidden md:block md:w-1/2 bg-gray-900 relative">
          <img
            src={registercustomer}
            alt="Register Visual"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-purple-900/30 to-transparent"></div>
          <div className="absolute top-8 left-8">
            <h2 className="text-3xl font-bold text-white mb-2">Join the Electric Revolution</h2>
            <p className="text-gray-300">Power your journey with smart charging</p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-800/95 rounded-2xl md:rounded-none">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                Get Charged Up
              </h1>
              <p className="text-gray-400 mt-2">Create your EV charging account</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 ${
                      errors.firstName ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 ${
                      errors.lastName ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* NIC Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  NIC Number
                </label>
                <input
                  type="text"
                  name="nic"
                  value={form.nic}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 ${
                    errors.nic ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter your NIC number"
                />
                {errors.nic && (
                  <p className="text-sm text-red-400 mt-2">{errors.nic}</p>
                )}
              </div>

              {/* Vehicle Info Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 ${
                      errors.vehicleType ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="e.g., Tesla Model 3"
                  />
                  {errors.vehicleType && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.vehicleType}
                    </p>
                  )}
                </div>

                {/* Vehicle Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={form.vehicleNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 ${
                      errors.vehicleNumber
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="Registration number"
                  />
                  {errors.vehicleNumber && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.vehicleNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    name="passwordHash"
                    value={form.passwordHash}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 ${
                      errors.passwordHash ? "border-red-500" : "border-gray-600"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    {showPwd ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                {errors.passwordHash && (
                  <p className="text-sm text-red-400 mt-2">
                    {errors.passwordHash}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    {showConfirmPwd ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400 mt-2">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg mt-6"
              >
                {loading ? "Activating Account..." : "Start Your EV Journey"}
              </Button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-600"></div>
                <span className="px-4 text-gray-400 text-sm">Already Charging?</span>
                <div className="flex-1 border-t border-gray-600"></div>
              </div>

              {/* Login Redirect */}
              <p className="text-sm text-center text-gray-400">
                Already part of the EV community?{" "}
                <Link
                  to="/login/ev-owner"
                  className="text-amber-500 font-semibold hover:text-amber-400 hover:underline transition-colors"
                >
                  Access Your Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}