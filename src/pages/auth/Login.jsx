import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Button from "../../components/loading/Button";
import registercustomer from "../../assets/auth/register-customer.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [pwdError, setPwdError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    setEmailError("");
    setPwdError("");

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email");
      valid = false;
    }

    if (!password) {
      setPwdError("Password is required");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      // Cookie expiry: 60 days if remember checked, else 3 hours
      const expires = remember ? 60 : 0.125;

      // Save entire response
      Cookies.set("userId", data.id, { expires });
      Cookies.set("accessToken", data.accessToken, { expires });
      Cookies.set("accessTokenExpiresAtUtc", data.accessTokenExpiresAtUtc, {
        expires,
      });
      Cookies.set("refreshToken", data.refreshToken, { expires });
      Cookies.set("refreshTokenExpiresAtUtc", data.refreshTokenExpiresAtUtc, {
        expires,
      });
      Cookies.set("email", data.email, { expires });
      Cookies.set("fullName", data.fullName, { expires });
      Cookies.set("roles", JSON.stringify(data.roles), { expires });
      navigate("/");
      window.location.reload();
    } catch (err) {
      Swal.fire({
        title: "Access Denied",
        text: err.message || "Authentication failed. Please verify your credentials.",
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
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Background Image for Mobile */}
      <div className="md:hidden absolute inset-0 z-0">
        <img
          src={registercustomer}
          alt="Login Background"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="bg-gray-800/90 w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden min-h-[650px] z-10 border border-purple-500/20 backdrop-blur-sm">
        {/* Left Image Panel */}
        <div className="hidden md:block md:w-1/2 bg-gray-900 relative">
          <img
            src={registercustomer}
            alt="Login Visual"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-gray-900/80"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-2xl font-bold text-white mb-2">Charge Forward</h2>
            <p className="text-gray-300">Manage your charging stations with precision and power</p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-800/95 rounded-2xl md:rounded-none">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">⚡</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Station Control
              </h1>
              <p className="text-gray-400 mt-2">Access your management dashboard</p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400 ${
                    emailError ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter your email"
                />
                {emailError && (
                  <p className="text-sm text-red-400 mt-2">{emailError}</p>
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
                    className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400 ${
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
                    className="w-5 h-5 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                  />
                  <span className="ml-3 text-gray-300">Keep me signed in</span>
                </label>
                <Link
                  to="/login"
                  className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
                >
                  Reset Password
                </Link>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                loading={loading}
                disabled={!email || !password || loading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {loading ? "Authenticating..." : "Enter Dashboard"}
              </Button>

              {/* Divider */}
              <div className="flex items-center my-8">
                <div className="flex-1 border-t border-gray-600"></div>
                <span className="px-4 text-gray-400 text-sm">Need Access?</span>
                <div className="flex-1 border-t border-gray-600"></div>
              </div>

              {/* Signup Redirect */}
              <p className="text-sm text-center text-gray-400">
                Don't have station access?{" "}
                <Link
                  to="/register"
                  className="text-amber-500 font-semibold hover:text-amber-400 hover:underline transition-colors"
                >
                  Request Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}