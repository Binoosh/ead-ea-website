import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Button from "../../components/loading/Button";
import registercustomer from "../../assets/auth/register-customer.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginEvOwner } from "../../services/evOwnersService";

export default function EVOwnerLogin() {
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [nicError, setNicError] = useState("");
  const [pwdError, setPwdError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    setNicError("");
    setPwdError("");

    if (!nic) {
      setNicError("NIC is required");
      valid = false;
    } else if (nic.length < 10) {
      setNicError("Enter a valid NIC");
      valid = false;
    }

    if (!password) {
      setPwdError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPwdError("Password must be at least 6 characters");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const data = await loginEvOwner({ nic, password });

      // Cookie expiry: 60 days if remember checked, else 3 hours
      const expires = remember ? 60 : 0.125;

      // Save EV owner data in cookies
      Cookies.set("evOwnerAccessToken", "ev-owner-token", { expires });
      Cookies.set("evOwnerId", data.owner.id, { expires });
      Cookies.set("evOwnerFirstName", data.owner.firstName, { expires });
      Cookies.set("evOwnerLastName", data.owner.lastName, { expires });
      Cookies.set("evOwnerNic", data.owner.nic, { expires });
      Cookies.set("evOwnerVehicleType", data.owner.vehicleType, { expires });
      Cookies.set("evOwnerVehicleNumber", data.owner.vehicleNumber, {
        expires,
      });
      Cookies.set("roles", "EVOwner", { expires });

      // Show success message
      Swal.fire({
        title: "Login Successful!",
        text: `Welcome back, ${data.owner.firstName}!`,
        icon: "success",
        confirmButtonColor: "#8b5cf6",
        background: "#1f2937",
        color: "#f3f4f6"
      });

      // Navigate to EV owner dashboard or home page
      navigate("/");
      window.location.reload();
    } catch (err) {
      Swal.fire({
        title: "Login Failed",
        text: err.message || "Invalid NIC or password. Please try again.",
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
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Background Image for Mobile */}
      <div className="md:hidden absolute inset-0 z-0">
        <img
          src={registercustomer}
          alt="Login Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="bg-gray-800 w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden min-h-[650px] z-10 border border-gray-700">
        {/* Left Image Panel */}
        <div className="hidden md:block md:w-1/2 bg-gray-900 relative">
          <img
            src={registercustomer}
            alt="Login Visual"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-800/95 rounded-2xl md:rounded-none">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-amber-500 bg-clip-text text-transparent">
                Power Up Your Ride
              </h1>
              <p className="text-gray-400 mt-2 text-lg">Access your EV charging account</p>
            </div>

            <div className="space-y-6">
              {/* NIC Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  NIC Number
                </label>
                <input
                  type="text"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 ${
                    nicError ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter your NIC number"
                />
                {nicError && (
                  <p className="text-sm text-red-400 mt-2">{nicError}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 ${
                      pwdError ? "border-red-500" : "border-gray-600"
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
                {pwdError && (
                  <p className="text-sm text-red-400 mt-2">{pwdError}</p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="ml-3 text-gray-300">Remember me</span>
                </label>
                <Link
                  to="/ev-owner/forgot-password"
                  className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                loading={loading}
                disabled={!nic || !password || loading}
                className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                {loading ? "Powering Up..." : "Connect to Your Account"}
              </Button>

              {/* Divider */}
              <div className="flex items-center my-8">
                <div className="flex-1 border-t border-gray-600"></div>
                <span className="px-4 text-gray-400 text-sm">New to EV Charging?</span>
                <div className="flex-1 border-t border-gray-600"></div>
              </div>

              {/* Signup Redirect */}
              <p className="text-sm text-center text-gray-400">
                Ready to join the revolution?{" "}
                <Link
                  to="/register/ev-owner"
                  className="text-amber-500 font-semibold hover:text-amber-400 hover:underline transition-colors"
                >
                  Start Your Journey!
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}